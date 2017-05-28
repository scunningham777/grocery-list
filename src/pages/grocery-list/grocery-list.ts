import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { ListService } from '../../providers/list-service';
import { ListItemService } from '../../providers/list-item-service';
import { List, ListItem } from '../../models/models';

@IonicPage()
@Component({
    selector: 'grosh-grocery-list-page',
    templateUrl: 'grocery-list.html',
})
export class GroceryListPage {
    public list: List;
    public listItems$: Observable<ListItem[]>;
    public listItemsByCategory$: Observable<any[]>;

    constructor(
        public navParams: NavParams,
        public listSvc: ListService,
        public itemSvc: ListItemService,
        public modalCtrl: ModalController
    ) {
        listSvc.getListById(navParams.get('listId'))
            .subscribe(list => {
                this.list = list;
            });

        this.listItems$ = itemSvc.getAllListItemsForList(navParams.get('listId'));
        this.listItemsByCategory$ = this.listItems$
            .map((listItems: ListItem[]) => {
                return listItems.reduce((acc, listItem: ListItem) => {
                    //ignore this item if the name somehow got erased or if the quantity somehow got set to 0
                    if (!listItem.itemName || !listItem.quantity) {
                        return acc;
                    }
                    
                    if (acc.find(cat => cat.name == listItem.categoryName) === undefined) {
                        acc.push({
                            name: listItem.categoryName,
                            items: []
                        });
                    }
                    acc.find(cat => cat.name == listItem.categoryName).items.push(listItem);
                    return acc;
                }, [])
                .sort((a, b) => {
                    if (a.name == null) return 1;
                    if (b.name == null) return -1;
                    else {
                        return a.name.localeCompare(b.name);
                    }
                })
            })
    }

    createAndAddListItem() {
        let modal = this.modalCtrl.create('AddListItemModal', {listId: this.list.$key});
        modal.present();
    }

    checkCompletedSwipe(event, listItemId) {
        const slidePercent = event.getSlidingPercent()
        if (slidePercent < 0) {
            if (slidePercent < -2) {
                this.completeItem(listItemId);
            } else {
                console.dir(event);
            }
        }
    }

    completeItem(listItemId: string) {
        console.log('Item completed: ', listItemId);
    }

    editItem(listItemId: string, itemElem: ItemSliding) {
        itemElem.close();
        this.presentEditModal(listItemId);
    }

    presentEditModal(listItemId: string) {
        let modal = this.modalCtrl.create('EditListItemModal', { listItemId: listItemId });
        modal.present();
    }

    deleteItem(listItemId: string, itemElem: ItemSliding) {
        itemElem.close();
        this.itemSvc.deleteListItem(this.list.$key, listItemId);
    }
}
