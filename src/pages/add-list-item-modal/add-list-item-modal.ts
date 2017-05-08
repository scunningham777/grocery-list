import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddListItemModal page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-add-list-item-modal',
    templateUrl: 'add-list-item-modal.html',
})
export class AddListItemModal {

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddListItemModal');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
