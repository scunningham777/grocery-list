import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditListItemModal } from './edit-list-item-modal';

@NgModule({
    declarations: [
        EditListItemModal,
    ],
    imports: [
        IonicPageModule.forChild(EditListItemModal),
    ],
    exports: [
        EditListItemModal
    ]
})
export class EditListItemModalPageModule { }
