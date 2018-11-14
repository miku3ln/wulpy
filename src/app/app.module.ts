import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
/*---PROVIDERS---*/
import {ConfigProvider} from '../providers/config/config';
import {DataManagerTemplateProvider} from '../providers/data-manager-template/data-manager-template';

import {DataManagerProvider} from '../providers/data-manager/data-manager';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

/*----plugins---*/

import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";
/*FIREBASE*/
import {ConfigDataFirebaseProvider} from '../providers/config-data-firebase/config-data-firebase';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireStorage, AngularFireStorageModule, AngularFireUploadTask} from 'angularfire2/storage';
/*-----SERVICES---*/
import {AppSettings} from '../services/app-settings';
import {ToastService} from '../services/toast-service';
import {LoadingService} from '../services/loading-service';
import {ContactService} from '../services/contact-service';

import {Network} from '@ionic-native/network';

import {ConnectivityService} from '../services/connectivity-service';

import {BranchIoManagementProvider} from '../providers/branch-io-management/branch-io-management';
import {SocialSharing} from '@ionic-native/social-sharing';
import {MenuService} from "../services/menu-service";
import {AlertProvider} from "../providers/alert/alert";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({}),
    HttpClientModule,
    HttpModule,
    AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
    AngularFireDatabaseModule, AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    DataManagerTemplateProvider,
    DataManagerProvider,
    ConfigDataFirebaseProvider,
    /*---PLUGINS--*/
    AngularFireDatabase,
    /* ---SERVICES---*/
    ToastService,
    LoadingService,
    ContactService,
    BranchIoManagementProvider,
    SocialSharing,
    MenuService,
    ConnectivityService,
    Network,
    AlertProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
