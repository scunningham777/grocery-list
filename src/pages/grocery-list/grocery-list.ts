import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ListService } from '../../providers/list-service';
import { IList } from '../../models/models';

@IonicPage()
@Component({
    selector: 'grosh-grocery-list-page',
    templateUrl: 'grocery-list.html',
})
export class GroceryListPage {
    public list$: Observable<IList>;

    constructor(
        public navParams: NavParams,
        public listSvc: ListService
    ) {
        this.list$ = listSvc.getListById(navParams.get('listId'));
        //this is returning a list observable - any way to get it to be an object observable?
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroceryList');
    }

}
