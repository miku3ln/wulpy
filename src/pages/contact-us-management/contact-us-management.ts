import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {LoadingProvider} from "../../providers/loading/loading";
import {ToastService} from "../../services/toast-service";
import {ContactUsManagementService} from "../../services/contact-us-management-service";
import {GoogleMapsConfigurationProvider} from "../../providers/google-maps-configuration/google-maps-configuration";
import { GoogleMapsEvent, Marker} from "@ionic-native/google-maps";
import {ConnectivityService} from "../../services/connectivity-service";
import {ConfigProvider} from "../../providers/config/config";

/**
 * Generated class for the ContactUsManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contact-us-management',
  templateUrl: 'contact-us-management.html',
})
export class ContactUsManagementPage {
  @ViewChild('mapContactManagement') currentMap: ElementRef;
  public paramsPage: Object = {};
  public createRegister: boolean = true;
  public title: string = "Contactanos";
  public formData = {
    title: '',
    description: '',
    address: "",
    phoneNo: "",
    position: {
      lat: "",
      lng: ""
    },
    email: ""
  };
  errorMessage = '';
  public mapCurrentObj = null;
  public btnRegisterTitle: string = "Registrar";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ContactUsManagementService,
    public loading: LoadingProvider,
    public toast: ToastService,
    public  googleMapsConfiguration: GoogleMapsConfigurationProvider,
    public connnectivity: ConnectivityService,
    public events: Events,
    public config: ConfigProvider,
  ) {

  }


  initGetData() {
    this.loading.show(true);
    let statusNetwork = this.connnectivity.isOnline();
    this.service.load(statusNetwork).subscribe(paramsPage => {
      this.paramsPage = paramsPage;
      this.setDataPage(paramsPage);
      this.loading.hide();
    }, error => {
      console.log("error");
      this.loading.hide();
    }, () => {
      console.log("complete");
    });
  }

  setDataPage(data) {
    if (data) {
      this.btnRegisterTitle = "Actualizar";
      this.createRegister = false;
      this.formData = {
        title: data.params.title,
        description: data.params.description ? data.params.description : "",
        address: data.params.address,
        phoneNo: data.params.phoneNo,
        position: {
          lat: data.params.position.lat,
          lng: data.params.position.lng
        },
        email: data.params.email
      }
      if (!this.mapCurrentObj) {//init new
        this.initMapCurrent(this.formData.position.lat, this.formData.position.lng);
      } else {
        //  this.mapCurrentObj.clear();


      }
    } else {
      this.btnRegisterTitle = "Registrar";
      this.createRegister = true;
    }
  }


  saveRegister() {
    this.initManagement();
    this.errorMessage = '';
    if (this.createRegister) {
      let paramsSave = {
        data: {params: this.formData}
      }
      let result = this.managementRegisterDb(paramsSave);
      this.endManagement("Guardardo Correctament");
    } else {//update

      let paramsSave = {
        data: {params: this.formData}
      }
      let result = this.managementRegisterDb(paramsSave);
      console.log("res", result);
      this.endManagement("Actualizado Correctament");
    }

  }

  endManagement(msj) {
    this.toast.presentToast(msj, {position: "down", duration: 4000});
    this.loading.hide();

  }

  initManagement() {

    this.loading.show();

  }

  managementRegisterDb(params) {
    if (this.createRegister) {
      return this.service.putDataConfig(params);

    } else {
      return this.service.updateDataConfig(params);
    }
  }

  initMapCurrent(lat, lng) {
    console.log("initMapCurrent cotactt mana");
    let that = this;

    let typeMap = 4;
    let paramsInitMap = {
      elementInitMap: this.googleMapsConfiguration.getElementInitObjectMap(typeMap),
      mapInitCurrent: this.googleMapsConfiguration.getObjectMap(typeMap),
    };
    this.googleMapsConfiguration.initGoogleMap(paramsInitMap).subscribe(result => {
      let mapInit = result.mapInit;
      that.mapCurrentObj = mapInit;
      that.googleMapsConfiguration.setObjectMap(typeMap, mapInit);
      this.initEventsGoogleMap(mapInit, lat, lng);

    }, error => {
      console.log("error-- init map");

    });
  }

  initEventsGoogleMap(mapInit, lat, lng) {
    let typeMap = 4;

    /* ----INIT MAP---*/
    if (mapInit) {
      this.googleMapsConfiguration.getInitEventMapReady(mapInit)
        .subscribe(() => {
          let eventName = "MAP_READY";
          this.events.publish('initReady:map', typeMap, eventName);
          mapInit.setMyLocationEnabled(true);
          mapInit.setMyLocationButtonEnabled(true);
          let target = {lat: parseFloat(lat), lng: parseFloat(lng)};
          mapInit.animateCamera({
            target: target,
            zoom: 17,
            duration: 800
          }).then(() => {

            let paramsSet = {
              title: "Mover el map para agregar su localización.",
              icon: "blue",
              animation: "DROP",
              position: {lat: lat, lng: lng},
              draggable: false,
            };
            let markerCurrent;
            mapInit.addMarker(paramsSet).then((marker: Marker) => {
              // show the infoWindow
              marker.showInfoWindow();
              markerCurrent = marker;
              let eventName = GoogleMapsEvent.MARKER_CLICK;
              // If clicked it, display the alert
              marker.on(eventName).subscribe((result) => {
                let target = result[0];
                let map = mapInit;
                map.animateCamera({
                    target: target,
                    zoom: 17,
                    duration: 800
                  }
                ).then(() => {

                  marker.showInfoWindow();
                });
              });


            });

            let googleMapEvent = GoogleMapsEvent.MAP_DRAG;
            mapInit.on(googleMapEvent).subscribe((result) => {
              let optionsMap = mapInit.getCameraPosition();
              let target = optionsMap.target;
              if (markerCurrent) {
                let positionNew = {
                  lat: target.lat,
                  lng: target.lng
                };
                markerCurrent.setPosition(positionNew);
                this.formData.position = positionNew;
              }
            });
            this.loading.hide();
          });
        });
    }


  }

  ionViewWillEnter() {
    console.log("ionViewWillEnterInit");

  }

  ionViewDidEnter() {
    this.initGetData();
  }

  ionViewWillLeave() {
 /*   console.log("ionViewWillLeaveInit");
    document.getElementById(this.googleMapsConfiguration.getElementInitObjectMap(4)).remove();*/
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeaveInit");

  }

  ionViewWillUnload() {
    console.log("ionViewWillUnloadInit");

  }

  ionViewCanLeave() {
    console.log("ionViewCanLeaveInit", "authenticated -------->");


  }
}

