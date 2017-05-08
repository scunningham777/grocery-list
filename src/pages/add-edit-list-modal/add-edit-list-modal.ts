import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavParams, ViewController, Loading, LoadingController } from 'ionic-angular';
import { ListService } from '../../providers/list-service';
import { List } from '../../models/models';

@IonicPage()
@Component({
    selector: 'add-edit-list-modal',
    templateUrl: 'add-edit-list-modal.html',
})
export class AddEditListModal {
    public title: string = 'Create a New List';
    public listId: string;
    public listForm: FormGroup;
    public loading: Loading

    constructor(
        public viewCtrl: ViewController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public listSvc: ListService,
        formBuilder: FormBuilder
    ) {
        this.listId = navParams.get('listId');
        if (this.listId != null) {
            this.title = 'Edit a List';
            this.presentLoading();
            this.listSvc.getListById(this.listId).subscribe((list: List) => {
                this.listForm = formBuilder.group({
                    name: [list.name, Validators.required]
                })
                this.loading.dismiss();
            });
        } else {
            this.listForm = formBuilder.group({
                name: ['', Validators.required]
            })
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    submit() {
        if (this.listId != null) {
            this.listSvc.updateListNameById(this.listId, this.listForm.value.name);
        } else {
            this.listSvc.addNewList(this.listForm.value.name);
        }
        this.dismiss();
    }

    presentLoading() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
    }
}
