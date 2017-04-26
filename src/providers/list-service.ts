import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

export interface IList {
    id: string,
    name: string,
    itemCount: number,
    isDeleted: boolean
}

var nextId = 2;

@Injectable()
export class ListService {
    public allLists: IList[] = listData;

    constructor() {
        console.log('Hello ListService Provider');
    }

    getAllActiveLists(): any[] {
        console.log('all lists requested')
        return this.allLists.filter((list) => {
            return list.isDeleted === false;
        });
    }

    getListById(listId: string): IList {
        return this.allLists.find((list: IList) => {
            return list.id == listId;
        });
    }

    addNewList(name: string) {
        this.allLists.push({id: this._getNextId(), name: name, itemCount: 0, isDeleted: false});
    }

    updateListNameById(listId: string, newName: string): IList {
        let requestedListIndex = this._getListIndexById(listId);

        this.allLists[requestedListIndex].name = newName || '';

        return this.allLists[requestedListIndex];
    }

    deleteList(id: string): any[] {
        let requestedListIndex = this._getListIndexById(id);

        if (requestedListIndex != -1) {
            this.allLists[requestedListIndex].isDeleted = true;
        }

        return this.getAllActiveLists();
    }

    _getListIndexById(listId: string): number {
        return this.allLists.findIndex((list) => {
            return list.id == listId;
        })
    }

    _getNextId(): string {
        return '' + nextId++;
    }

}

let listData: IList[] = [
    {
        id: '0',
        name: 'list 1',
        itemCount: 4,
        isDeleted: false
    },
    {
        id: '1',
        name: 'second list',
        itemCount: 0,
        isDeleted: false
    }
]