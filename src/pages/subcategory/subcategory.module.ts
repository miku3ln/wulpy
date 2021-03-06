import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SubcategoryPage} from './subcategory';
import {FirebaseStorageService} from "../../services/firebase-storage";
import {ToastService} from "../../services/toast-service";
import {ManagementFilesService} from "../../services/management-files";
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {AlertProvider} from "../../providers/alert/alert";
import {LoadingProvider} from "../../providers/loading/loading";
import {FileChooser} from "@ionic-native/file-chooser";
import {FileOpener} from "@ionic-native/file-opener";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {Camera} from "@ionic-native/camera";
import {Base64} from "@ionic-native/base64";
import {CategoriesService} from "../../services/categories-service";

@NgModule({
  declarations: [
    SubcategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SubcategoryPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ManagementFilesService,
    FirebaseStorageService,
    ToastService,
    ConfigDataFirebaseProvider,
    AlertProvider,
    LoadingProvider,
    FileChooser,
    FileOpener,
    FilePath,
    File,
    Camera,
    Base64,
    CategoriesService

  ]
})

export class SubcategoryPageModule {
}
