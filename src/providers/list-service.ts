import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/filter';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { IList } from '../models/models';

@Injectable()
export class ListService {
    public allLists$: FirebaseListObservable<IList[]>;

    constructor(
        public af: AngularFire
    ) {
        console.log('Hello ListService Provider');
        this.allLists$ = af.database.list('/lists');
    }

    getAllActiveLists(): Observable<IList[]> {
        console.log('all lists requested')
        return this.allLists$.map((lists: IList[]) => {
            return lists.filter((list: IList) => {
                return list.isActive;
            })
        });
    }

    getListById(listKey: string): Observable<IList> {
        return this.allLists$.map((lists) => {
            return lists.find((list) => {
                return list.$key == listKey;
            })
        });
    }

    addNewList(name: string) {
        let newList: IList = { name: name, isActive: false, dateCreated: new Date().toLocaleDateString() };
        this.allLists$.push(newList);
    }

    updateListNameById(listKey: string, newName: string) {
        this.allLists$.update(listKey, { name: newName });
    }

    deleteList(listKey: string) {
        this.allLists$.update(listKey, { isDeleted: true });
    }
}
