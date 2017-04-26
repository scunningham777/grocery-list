import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';
import { ListService } from '../providers/list-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// export const firebaseConfig = {
//   apiKey: '',
//   authDomain: 'tallman.firebaseapp.com',
//   databaseUrl: 'https://tallman.firebaseio.com',
//   storageBucket: 'tallman.appspot.com',
//   messagingSenderId: '<tallman-sender>'
// }

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)//,
    // AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ListService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
