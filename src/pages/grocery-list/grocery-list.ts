import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';

import { ListService } from '../../providers/list-service';
import { ListItemService } from '../../providers/list-item-service';
import { List, ListItem } from '../../models/models';
import { EditListItemModal } from '../edit-list-item-modal/edit-list-item-modal';

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

    ionViewDidLoad() {
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

    editItem(listItemId: string, item: ItemSliding) {
        item.close();
        this.presentEditModal(listItemId);
    }

    presentEditModal(listItemId: string) {
        let modal = this.modalCtrl.create('EditListItemModal', { listItemId: listItemId });
        modal.present();
    }
}
