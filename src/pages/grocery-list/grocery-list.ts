import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, ItemSliding, ToastController } from 'ionic-angular';
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
    public isListItemsLoading: boolean;
    public hasCompletedItems$: Observable<boolean>;

    constructor(
        public navParams: NavParams,
        public listSvc: ListService,
        public itemSvc: ListItemService,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
    ) {
        listSvc.getListById(navParams.get('listId'))
            .subscribe(list => {
                this.list = list;
            });

        this.isListItemsLoading = true;
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
            .do(() => {
                this.isListItemsLoading = false;
            })

        this.hasCompletedItems$ = this.listItems$
            .map((listItems: ListItem[]) => {
                const completedItem = listItems.find((listItem: ListItem) => listItem.isCompleted);
                return completedItem != null;
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
        this.itemSvc.updateListItemCompleted(listItemId)
            .subscribe(() => {
                console.log('Item completed: ', listItemId);
            })
    }

    editItem(listItemId: string, itemElem?: ItemSliding) {
        if (!!itemElem) {
            itemElem.close();
        }
        this.presentEditModal(listItemId);
    }

    presentEditModal(listItemId: string) {
        let modal = this.modalCtrl.create('EditListItemModal', { listItemId: listItemId, sourceListId: this.list.$key });
        modal.onDidDismiss(this.handleEditCallback.bind(this));
        modal.present();
    }

    handleEditCallback (data: {editedItem: ListItem, transferListId?: string}) {
        if (!!data && !!data.transferListId) {
            //get new list name
            this.listSvc.getListById(data.transferListId)
                .subscribe((newList: List) => {
                    //create toast
                    const toastMsg = `Item '${data.editedItem.itemName}' moved to list '${newList.name}'`;
                    const movedToast = this.toastCtrl.create({
                        message: toastMsg,
                        duration: 3000,
                        position: 'top'
                    })
                    //present
                    movedToast.present();
                })
        }       
    }

    deleteItem(listItemId: string, itemElem?: ItemSliding) {
        if(!!itemElem) {
            itemElem.close();
        }
        this.itemSvc.deleteListItem(this.list.$key, listItemId);
    }

    deleteCompletedItems() {
        if (!!this.list) {
            this.itemSvc.getAllListItemsForList(this.list.$key)
                .first()
                .do((listItems: ListItem[]) => {
                    const completedItems: ListItem[] = listItems.filter((item: ListItem) => item.isCompleted);
                    for (let completedItem of completedItems) {
                        this.deleteItem(completedItem.$key);
                    }
                })
                .subscribe();
        }
    }
}
