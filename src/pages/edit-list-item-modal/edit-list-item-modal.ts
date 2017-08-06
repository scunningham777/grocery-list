import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { ListItemService } from '../../providers/list-item-service';
import { ListService } from '../../providers/list-service';
import { ListItem, List } from '../../models/models';

@IonicPage()
@Component({
    selector: 'grosh-edit-list-item-modal',
    templateUrl: 'edit-list-item-modal.html',
})
export class EditListItemModal {
    public listItem: ListItem;
    public sourceListId: string;
    public itemName: string;
    public quantity: string;
    public loading: Loading;
    public availableTransferLists: List[];
    public selectedTransferListId: string;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public itemSvc: ListItemService,
        public listSvc: ListService,
    ) {
        this.presentLoading();

        const itemId = navParams.get('listItemId');
        this.sourceListId = navParams.get('sourceListId');

        if(!itemId) {
            console.error('No id passed to EditListItemModal');
            this.dismiss();
        }
        if(!this.sourceListId) {
            console.error('No source list id passed to EditListItemModal');
            this.dismiss();
        }

        this.itemSvc.getListItemById(itemId)
            .first()
            .subscribe(listItem => {
                this.listItem = listItem;
                this.loading.dismiss()
                    .then(() => {
                        this.loading = null
                    });
            })
        this.listSvc.getAllActiveLists()
            .first()
            .subscribe((activeLists: List[]) => {
                this.availableTransferLists = activeLists.filter((list: List) => list.$key != this.sourceListId);
            })
    }

    presentLoading(): Promise<any> {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create();
            return this.loading.present();
        } else {
            return Promise.resolve(this.loading);
        }
    }

    submitUpdate() {
        this.presentLoading()
            .then(() => {
                this.itemSvc.updateListItem(this.listItem, this.sourceListId, this.selectedTransferListId)
                    .subscribe(() => {
                        this.dismiss();
                    })
            });
    }   

    dismiss() {
        if (!!this.loading) {
            this.loading.dismiss();
        }
        this.viewCtrl.dismiss({editedItem: this.listItem, transferListId: this.selectedTransferListId});
    }
}
