import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { Item } from '../models/models';

@Injectable()
export class ListItemService {
    private sdkDb: any;

    constructor(
        public db: AngularFireDatabase,
        public fb: FirebaseApp
    ) {
        this.sdkDb = fb.database().ref();
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
            //TODO: after implementing 'getListItemsForList()', simply call that method first and call .first() on it with predicate to find if the listItem already exists
            return this.db.list('listItems', {
                query: {
                    orderByChild: 'itemId',
                    equalTo: resolvedItemId
                }
            }).first().map((listItems: any[]) => {
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
