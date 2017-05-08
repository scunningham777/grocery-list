import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ListService } from '../../providers/list-service';
import { List } from '../../models/models';

@IonicPage()
@Component({
    selector: 'grosh-grocery-list-page',
    templateUrl: 'grocery-list.html',
})
export class GroceryListPage {
    public list: List;

    constructor(
        public navParams: NavParams,
        public listSvc: ListService,
        public modalCtrl: ModalController
    ) {
        listSvc.getListById(navParams.get('listId'))
            .subscribe(list => {
                this.list = list;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroceryList');
    }

    createAndAddListItem() {
        let modal = this.modalCtrl.create('AddListItemModal');
        modal.present();
    }

}
