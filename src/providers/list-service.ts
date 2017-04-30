import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/filter';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

export interface IList {
    $key: string,
    name: string,
    itemCount: number,
    isDeleted: boolean
}

// var nextId = 2;

@Injectable()
export class ListService {
    // public allLists: IList[] = listData;
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
                return !list.isDeleted;
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
        this.allLists$.push({name: name, itemCount: 0, isDeleted: false});
    }

    updateListNameById(listKey: string, newName: string) {
        // let requestedListIndex = this._getListIndexById(listId);

        // this.allLists$[requestedListIndex].name = newName || '';

        // return this.allLists$[requestedListIndex];
        this.allLists$.update(listKey, {name: newName});
    }

    deleteList(listKey: string) {
        // let requestedListIndex = this._getListIndexById(id);

        // if (requestedListIndex != -1) {
        //     this.allLists$[requestedListIndex].isDeleted = true;
        // }

        // return this.getAllActiveLists();
        this.allLists$.update(listKey, {isDeleted: true});
    }

    // _getListIndexById(listId: string): number {
    //     return this.allLists$.findIndex((list) => {
    //         return list.id == listId;
    //     })
    // }

    // _getNextId(): string {
    //     return '' + nextId++;
    // }

}

// let listData: IList[] = [
//     {
//         id: '0',
//         name: 'list 1',
//         itemCount: 4,
//         isDeleted: false
//     },
//     {
//         id: '1',
//         name: 'second list',
//         itemCount: 0,
//         isDeleted: false
//     }
// ]