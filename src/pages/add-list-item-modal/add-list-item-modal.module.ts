import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddListItemModal } from './add-list-item-modal';

@NgModule({
    declarations: [
        AddListItemModal,
    ],
    imports: [
        IonicPageModule.forChild(AddListItemModal),
    ],
    exports: [
        AddListItemModal
    ]
})
export class AddListItemModalModule { }
