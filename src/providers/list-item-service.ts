import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseRef } from 'angularfire2';

@Injectable()
export class ListItemService {
    private sdkDb: any;

    constructor(
        public db: AngularFireDatabase,
        @Inject(FirebaseRef) fb
    ) {
        this.sdkDb = fb.database().ref();
    }

    addNewListItem(listId: string, itemName: string, itemId?: string): Observable<any> {
        let dataToSave = {};
        if (!itemId) {
            itemId = this.sdkDb.child('items').push().key;
            dataToSave['items/' + itemId] = {name: itemName, categoryId: null};
        }

        const listItemData = {itemId: itemId, quantity: 1, isCompleted: false};

        const newListItemKey = this.sdkDb.child('listItems').push().key;

        dataToSave[`listItems/${newListItemKey}`] = listItemData;
        dataToSave[`listItemsPerList/${listId}/${newListItemKey}`] = true;

        return this.firebaseUpdate(dataToSave);
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
