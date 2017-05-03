import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = 'ListsPage';
    tab2Root = 'RecipesPage';
    tab3Root = 'SettingsPage';

    constructor() {

    }
}
