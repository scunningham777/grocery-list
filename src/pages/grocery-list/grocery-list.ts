import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { ListService, IList } from '../../providers/list-service';

@IonicPage()
@Component({
    selector: 'grosh-grocery-list-page',
    templateUrl: 'grocery-list.html',
})
export class GroceryListPage {
    public list: IList;

    constructor(
        public navParams: NavParams,
        public listSvc: ListService
    ) {
        this.list = this.listSvc.getListById(navParams.get('listId'));
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroceryList');
    }

}
