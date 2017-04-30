import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ItemSliding } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ListService } from '../../providers/list-service';

@IonicPage()
@Component({
    selector: 'grosh-lists-page',
    templateUrl: 'lists.html'
})
export class ListsPage {
    public lists: Observable<any[]>;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public listSvc: ListService
    ) {
        this.lists = listSvc.getAllActiveLists();
    }

    createAndAddList() {
        this.presentAddEditModal(null);
    }

    editList(id: string, item: ItemSliding) {
        item.close();
        this.presentAddEditModal(id);
    }

    viewList(id: string) {
        this.navCtrl.push('GroceryListPage', {listId: id});
    }

    deleteList(id: string, item: ItemSliding) {
        item.close();
        this.listSvc.deleteList(id);
    }

    presentAddEditModal(listId?: string) {
        let modal = this.modalCtrl.create('AddEditListModal', {listId: listId});
        // modal.onDidDismiss(() => {
        //     this.lists = this.listSvc.getAllActiveLists();
        // });
        modal.present();
    }
}

