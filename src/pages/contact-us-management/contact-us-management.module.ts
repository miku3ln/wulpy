import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ContactUsManagementPage} from './contact-us-management';
import {GoogleMaps, Spherical} from "@ionic-native/google-maps";
import {Geolocation} from "@ionic-native/geolocation";
import {GoogleMapsConfigurationProvider} from "../../providers/google-maps-configuration/google-maps-configuration";
import {AlertProvider} from "../../providers/alert/alert";
import {LoadingProvider} from "../../providers/loading/loading";
import {ContactService} from "../../services/contact-service";
import {GoogleMapsClusterProvider} from "../../providers/google-maps-cluster/google-maps-cluster";
import {ContactUsManagementService} from "../../services/contact-us-management-service";
import {ConnectivityService} from "../../services/connectivity-service";
import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";

@NgModule({
  declarations: [
    ContactUsManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactUsManagementPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[
    GoogleMaps,
    Spherical,
    Geolocation,
    ContactService,
    GoogleMapsConfigurationProvider,
    GoogleMapsClusterProvider,
    ContactUsManagementService,
    ConnectivityService,
    AlertProvider,
    LoadingProvider,
    DataManagerPagesProvider
  ]

})

export class ContactUsManagementPageModule {
}
