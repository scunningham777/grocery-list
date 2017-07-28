import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { Item, ListItem } from '../models/models';

@Injectable()
export class ListItemService {
    private sdkDb: any;

    constructor(
        public db: AngularFireDatabase,
        public fb: FirebaseApp
    ) {
        this.sdkDb = fb.database().ref();
    }

    getAllListItemsForList(listId: string): Observable<ListItem[]> {
        const listItemsPerList$ = this.db.list(`listItemsPerList/${listId}`);

        const listItems$ = listItemsPerList$
            .map(listItemIds => {
                    if (listItemIds.length == 0) {
                        return [Observable.of({})];
                    } else {
                        return listItemIds.map(liId => this.getListItemById(liId.$key))
                    }
                })
            .mergeMap((listItem$s: Observable<ListItem>[]) => Observable.combineLatest(listItem$s))

        return listItems$;
    }

    getListItemById(listItemId: string): Observable<ListItem> {
        //TODO: try using "combineLatest()" at each step instead of switchMap(), using a "project" function to combine data
        const baseListItem$ = this.db.object(`listItems/${listItemId}`);
        const composedListItem$ = baseListItem$
            .switchMap(rawListItem => {
                return this.db.object(`items/${rawListItem.itemId}`)
                    .switchMap(item => {
                        return this.db.object(`categories/${item.categoryId}`)
                            .map(category => {
                                rawListItem.itemName = item.name;
                                rawListItem.categoryId = item.categoryId;
                                rawListItem.categoryName = category.name;
                                return ListItem.fromJson(rawListItem);
                            })
                    })
            })

        return composedListItem$;
    }

    getOrCreateItemByName(itemName: string): Observable<{itemId: string, isItemNew: boolean}> {
        const itemData$ = this.db.list('items', {
                query: {
                    orderByChild: 'name',
                    equalTo: itemName
                }
            }).first().map((items: any[]) => {
                let responseData: any = {};

                if (items.length == 0) {
                    responseData.itemId = this.sdkDb.child('items').push().key;
                    responseData.isItemNew = true;
                } else {
                    responseData.itemId = items[0].$key;
                    responseData.isItemNew = false;
                }
                return responseData;
            })

        return itemData$;
    }

    addNewListItem(listId: string, itemName: string, itemId?: string): Observable<any> {
        let dataToSave = {};
        let itemId$: Observable<string>;
        let update$: Observable<any>;

        if (!itemId) {
            itemId$ = this.getOrCreateItemByName(itemName)
                .map(itemData => {
                    if (itemData.isItemNew) {
                        dataToSave['items/' + itemId] = {name: itemName, categoryId: null};
                    }
                    return itemData.itemId;
                })
        } else {
            itemId$ = Observable.of(itemId);
        }

        update$ = itemId$.switchMap(resolvedItemId => {
            return this.getAllListItemsForList(listId)
                .first()
                .map((currentListItems: ListItem[]) => {
                    return currentListItems.filter((listItem: ListItem) => listItem.itemId == resolvedItemId);
                })
                .map((listItems: ListItem[]) => {
                    if (listItems.length == 0) {
                        const listItemData = {itemId: resolvedItemId, quantity: 1, isCompleted: false};

                        const newListItemKey = this.sdkDb.child('listItems').push().key;

                        dataToSave[`listItems/${newListItemKey}`] = listItemData;
                        dataToSave[`listItemsPerList/${listId}/${newListItemKey}`] = true;
                    } else {
                        dataToSave[`listItems/${listItems[0].$key}/quantity`] = listItems[0].quantity + 1;
                    }

                    return this.firebaseUpdate(dataToSave);
                });
        })

        return update$
    }

    getItemSuggestions(nameStart: string):  Observable<Item[]> {
        return this.db.list('items')
            .map((rawItems: Item[]): Item[] => {
                const items = Item.fromJsonList(rawItems);
                return items.filter((item: Item) => {
                    return item.name.startsWith(nameStart);
                })
            })
    }

    deleteListItem(listId: string, listItemId: string) {
        let dataToSave = {};
        //delete listItemPerList
        dataToSave[`listItemsPerList/${listId}/${listItemId}`] = null;
        //delete listItem   
        dataToSave[`listItems/${listItemId}`] = null,

        this.firebaseUpdate(dataToSave);
    }

    updateListItem(newItemData: ListItem): Observable<any> {
        let itemDiff$: Observable<{oldItemData: ListItem, alteredItemData: ListItem}>;     // alteredItemData should include an updated itemId if applicable
        let update$: Observable<any>;

        itemDiff$ = Observable.combineLatest(this.getListItemById(newItemData.$key).first(), Observable.of(newItemData))
            .switchMap(([oldItem, newItem]) => {
                if (oldItem.itemName != newItem.itemName) {
                    return this.getOrCreateItemByName(newItem.itemName)
                        .map(({itemId}) => {
                            newItem.itemId = itemId;
                            return {oldItemData: oldItem, alteredItemData: newItem};
                        });
                } else {
                    return Observable.of({oldItemData: oldItem, alteredItemData: newItem});
                }
            })

        //update$ needs to return the "dataToSave" object
        update$ = itemDiff$
            .map(({oldItemData, alteredItemData}) => {
                let dataToSave: any = {};
                //compare each relevant field with original to determine updates
                if (oldItemData.quantity != alteredItemData.quantity) {
                    dataToSave[`listItems/${oldItemData.$key}/quantity`] = alteredItemData.quantity;
                }

                if (oldItemData.itemId != alteredItemData.itemId) {
                    dataToSave[`listItems/${oldItemData.$key}/itemId`] = alteredItemData.itemId;
                    dataToSave[`items/${alteredItemData.itemId}`] = {name: alteredItemData.itemName, categoryId: alteredItemData.categoryId};
                }
                
                return dataToSave;
            })

        return update$.switchMap(this.firebaseUpdate.bind(this));
    }

    updateListItemCompleted(listItemKey: string, isCompleted?: boolean): Observable<any> {
        let dataToSave: any = {};
        let update$;

        if (isCompleted != null) {
            dataToSave[`listItems/${listItemKey}/isCompleted`] = isCompleted;
            update$ = Observable.of(dataToSave);
        } else {
            update$ = this.getListItemById(listItemKey)
                        .first()
                        .pluck('isCompleted')
                        .map((isCompleted: boolean) => {
                            dataToSave[`listItems/${listItemKey}/isCompleted`] = !isCompleted;
                            return dataToSave;
                        })
        }

        return update$.switchMap(this.firebaseUpdate.bind(this));
    }

    firebaseUpdate(dataToSave): Observable<any> {
        const subject = new Subject();

        if (!dataToSave || Object.getOwnPropertyNames(dataToSave).length == 0) {
            setTimeout(() => {
                subject.next(undefined);
                subject.complete();
            }, 15);
        } else {
            this.sdkDb.update(dataToSave)
                .then(val => {
                    subject.next(val);
                    subject.complete();
                }, err => {
                    subject.error(err);
                    subject.complete();
                });
        }

        return subject.asObservable();
    }

}
