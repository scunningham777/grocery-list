import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

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
    }

    ionViewDidLoad() {
    }

    createAndAddListItem() {
        let modal = this.modalCtrl.create('AddListItemModal', {listId: this.list.$key});
        modal.present();
    }

}
