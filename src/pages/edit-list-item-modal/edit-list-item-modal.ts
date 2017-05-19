import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { ListItemService } from '../../providers/list-item-service';

@IonicPage()
@Component({
    selector: 'grosh-edit-list-item-modal',
    templateUrl: 'edit-list-item-modal.html',
})
export class EditListItemModal {
    public itemName: string;
    public quantity: string;
    public loading: Loading

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public itemSvc: ListItemService
    ) {
        this.presentLoading();

        const itemId = navParams.get('listItemId');

        if(!itemId) {
            console.error('No id passed to EditListItemModal');
            this.dismiss();
        }

        this.itemSvc.getListItemById(itemId);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditListItemModalPage');
    }

    presentLoading() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}