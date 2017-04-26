import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditListModal } from './add-edit-list-modal';

@NgModule({
    declarations: [
        AddEditListModal,
    ],
    imports: [
        IonicPageModule.forChild(AddEditListModal),
    ],
    exports: [
        AddEditListModal
    ]
})
export class AddEditListModalModule { }
