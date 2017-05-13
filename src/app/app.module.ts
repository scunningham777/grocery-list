import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { GroshApp } from './app.component';
import { ListService } from '../providers/list-service';
import { ListItemService } from '../providers/list-item-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
    apiKey: "AIzaSyDGMw0ukjjB8eFVu9n9ceeyZm9ULZhxgzA",
    authDomain: "grocerylist-32df3.firebaseapp.com",
    databaseURL: "https://grocerylist-32df3.firebaseio.com",
    projectId: "grocerylist-32df3",
    storageBucket: "grocerylist-32df3.appspot.com",
    messagingSenderId: "1016085560887"
}

@NgModule({
    declarations: [
        GroshApp
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(GroshApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        GroshApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ListService,
        ListItemService,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
