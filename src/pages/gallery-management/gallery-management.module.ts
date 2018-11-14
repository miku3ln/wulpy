import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GalleryManagementPage} from './gallery-management';
import {ManagementFilesService} from "../../services/management-files";
import {FirebaseStorageService} from "../../services/firebase-storage";
import {ToastService} from "../../services/toast-service";
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {AlertProvider} from "../../providers/alert/alert";
import {LoadingProvider} from "../../providers/loading/loading";
import {FileChooser} from "@ionic-native/file-chooser";
import {FileOpener} from "@ionic-native/file-opener";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {Camera} from "@ionic-native/camera";
import {Base64} from "@ionic-native/base64";
import {GalleryManagementService} from "../../services/galery-management-service";
import {FileManagerPage} from "../file-manager/file-manager";

@NgModule({
  declarations: [
    GalleryManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(GalleryManagementPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoadingProvider,
    FileManagerPage,
    FirebaseStorageService, ToastService, ManagementFilesService, GalleryManagementService,
    FileChooser,
    FileOpener,
    FilePath,
    File,
    Camera,
    Base64,
  ]
})

export class GalleryManagementPageModule {
}
