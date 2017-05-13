import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { ListItemService } from '../../providers/list-item-service';
import { Item } from '../../models/models';

import 'rxjs/add/operator/do';

@IonicPage()
@Component({
    selector: 'page-add-list-item-modal',
    templateUrl: 'add-list-item-modal.html',
})
export class AddListItemModal {
    listId: string;
    inputName: string = '';
    loading: Loading;
    inputSubject: Subject<string>;
    suggestions$: Observable<Item[]>;

    constructor(
        public viewCtrl: ViewController, 
        public navParams: NavParams,
        public itemSvc: ListItemService,
        public loadingCtrl: LoadingController
    ) {
        this.listId = navParams.get('listId');
        this.initSuggestionHandling();

    }

    ionViewDidLoad() {
        this.inputSubject.next('');
    }

    initSuggestionHandling() {
        this.inputSubject = new Subject<string>();
        this.suggestions$ = this.inputSubject
            .do(() => console.log('input update'))
            .distinctUntilChanged()
            .switchMap(value => this.itemSvc.getItemSuggestions(value));
    }

    searchInput(newValue) {
        console.log(newValue);
        this.inputSubject.next(newValue);
    }

    submit(itemName, itemId?: string) {
        if (!itemName && !itemId) {
            alert('Please enter a name or select an existing item');
        } else {
            this.presentLoading();
            this.itemSvc.addNewListItem(this.listId, itemName, itemId)
                .subscribe(
                    () => {
                        this.loading.dismiss();
                        this.dismiss();
                    },
                    (err) => {
                        this.loading.dismiss();
                        alert('Error saving new item - please try again');
                    }
                )
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Saving...'
        })

        this.loading.present();
    }

}
