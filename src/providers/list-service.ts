import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

import { List } from '../models/models';

@Injectable()
export class ListService {

    constructor(
        public db: AngularFireDatabase
    ) {
    }

    getAllActiveLists(): Observable<List[]> {
        console.log('all lists requested')
        return this.db.list('lists')
            .map(List.fromJsonList)
            .map((lists: List[]) => {
                return lists.filter((list: List) => {
                    return list.isActive;
                })
        });
    }

    getListById(listKey: string): Observable<List> {
        return this.db.object('lists/' + listKey).map(List.fromJson);
    }

    addNewList(name: string) {
        const newList = { name: name, isActive: true, dateCreated: new Date().getTime().toString() };

        this.db.list('lists').push(newList);
    }

    updateListNameById(listKey: string, newName: string) {
        this.db.list('lists').update(listKey, { name: newName });
    }

    deleteList(listKey: string) {
        this.db.list('lists').update(listKey, { isDeleted: true });
    }
}
