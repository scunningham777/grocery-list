import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
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
            .do((data) => {
                console.log('listItemPerList update');
                console.log(data);
            })
            .map(listItemIds => {
                    if (listItemIds.length == 0) {
                        return [Observable.of({})];
                    } else {
                        return listItemIds.map(liId => this.getListItemById(liId.$key))
                    }
                })
            .mergeMap(listItem$s => Observable.combineLatest(listItem$s))
            .do(console.log)

        return listItems$;
    }

    getListItemById(listItemId: string): Observable<ListItem> {
        const baseListItem$ = this.db.object(`listItems/${listItemId}`);
        const composedListItem$ = baseListItem$
            .do((data) => {
                console.log('ListItem update');
                console.log(data);
            })
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

    addNewListItem(listId: string, itemName: string, itemId?: string): Observable<any> {
        let dataToSave = {};
        let itemId$: Observable<string>;
        let update$: Observable<any>;

        if (!itemId) {
            itemId$ = this.db.list('items', {
                query: {
                    orderByChild: 'name',
                    equalTo: itemName
                }
            }).first().map((items: any[]) => {
                if (items.length == 0) {
                    itemId = this.sdkDb.child('items').push().key;
                    dataToSave['items/' + itemId] = {name: itemName, categoryId: null};
                } else {
                    itemId = items[0].$key;
                }
                return itemId;
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

    firebaseUpdate(dataToSave) {
        const subject = new Subject();

        this.sdkDb.update(dataToSave)
            .then(val => {
                subject.next(val);
                subject.complete();
            }, err => {
                subject.error(err);
                subject.complete();
            });

        return subject.asObservable();
    }

}
