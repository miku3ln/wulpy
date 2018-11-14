import {Component, EventEmitter, Injectable, NgZone, Output} from '@angular/core';
import {DataManagerPagesProvider} from '../../providers/data-manager-pages/data-manager-pages';

import {AlertProvider} from '../../providers/alert/alert';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {Events} from "ionic-angular";
import {BehaviorSubject} from "rxjs";

import {GoogleMapsClusterProvider} from '../../providers/google-maps-cluster/google-maps-cluster';


/**
 * MAP EVENTS *************************************************
 *
 * MAP_READY: 'map_ready',
 * MAP_LOADED: 'map_loaded',
 * MAP_CLICK: 'map_click',
 * MAP_LONG_CLICK: 'map_long_click',
 * MY_LOCATION_BUTTON_CLICK: 'my_location_button_click',
 * INDOOR_BUILDING_FOCUSED: 'indoor_building_focused',
 * INDOOR_LEVEL_ACTIVATED: 'indoor_level_activated',
 * CAMERA_MOVE_START: 'camera_move_start',
 * CAMERA_MOVE: 'camera_move',
 * CAMERA_MOVE_END: 'camera_move_end',
 * OVERLAY_CLICK: 'overlay_click',
 * POLYGON_CLICK: 'polygon_click',
 * POLYLINE_CLICK: 'polyline_click',
 * CIRCLE_CLICK: 'circle_click',
 * GROUND_OVERLAY_CLICK: 'groundoverlay_click',
 * INFO_CLICK: 'info_click',
 * INFO_LONG_CLICK: 'info_long_click',
 * INFO_CLOSE: 'info_close',
 * INFO_OPEN: 'info_open',
 * CLUSTER_CLICK: 'cluster_click',
 * MARKER_CLICK: 'marker_click',
 * MARKER_DRAG: 'marker_drag',
 * MARKER_DRAG_START: 'marker_drag_start',
 * MARKER_DRAG_END: 'marker_drag_end',
 * MAP_DRAG: 'map_drag',
 * MAP_DRAG_START: 'map_drag_start',
 * MAP_DRAG_END: 'map_drag_end'
 */
@Injectable()
@Component({
  providers: [
    GoogleMaps,
    GoogleMap,
  ]
})
export class GoogleMapsConfigurationProvider {
  @Output() messageEvent = new EventEmitter<any>();
  public map: GoogleMap;
  public mapContact: GoogleMap
  public mapContactManagement: GoogleMap;
  public mapManager: GoogleMap;
  public mapContactDetails: GoogleMap;
  public elementInitMap: string = "map";
  public elementInitMapContact: string = "mapContact";
  public elementInitMapContactManagement: string = "mapContactManagement";
  public elementInitMapManager: string = "mapManager";
  public elementInitMapContactDetails: string = "mapContactDetails";

  mapElement: HTMLElement;
  mapElementContact: HTMLElement;
  classTransActive: boolean = false;
  public lng = -78.2628514;
  public lat = 0.2221273;
  public lngCurrent: number = -78.2628514;
  public latCurrent: number = 0.2221273;
  private currentPositionBS = new BehaviorSubject<any>({lat: this.latCurrent, lng: this.lngCurrent});
  public currentPositionOb = this.currentPositionBS.asObservable();

  public mapOptions;
  zone: any;

  static get parameters() {
    return [
      [GoogleMaps],
      [Events],
      [Geolocation],
      [NgZone],
      [Storage],
      [AlertProvider],
      [GoogleMapsClusterProvider],
      [DataManagerPagesProvider],

    ];
  }

  constructor(
    public googleMaps: GoogleMaps,
    public events: Events,
    private geolocation: Geolocation,
    public ngZone: NgZone,
    private storage: Storage,
    public alert: AlertProvider,
    public googleMapsCluster: GoogleMapsClusterProvider,
    public dataManagerPages: DataManagerPagesProvider
  ) {

  }

  getCurrentPositionDevice(): Observable<any> {
    let resultObservable = new Observable(observer => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latCurrent = resp.coords.latitude;
        this.lngCurrent = resp.coords.longitude;
        let positionCurrent = {lat: this.latCurrent, lng: this.lngCurrent};
        observer.next(positionCurrent);
      }).catch((error) => {
        observer.error([]);
        observer.complete();
      });
    });

    return resultObservable;
  }

  setNewPosition(positionCurrent) {
    this.currentPositionBS.next(positionCurrent);

  }

  resetMapByTpe(type): Promise<any> {
    let result;
    if (type == 1) {//wulpym
      if (this.map) {
        result = this.map.remove();
      } else {
        result = new Promise((resolve, reject) => {
          resolve({"resolve": false});
          reject({"reject": false});
        });
      }
    } else if (type == 2) {//contact
      if (this.mapContact) {
        result = this.mapContact.remove();
      } else {
        result = new Promise((resolve, reject) => {
          resolve({"resolve": false});
          reject({"reject": false});
        });
      }
    }


    return result;
  }

  reset(): Promise<any> {
    let result;
    if (this.map) {
      result = this.map.remove();
    } else {
      result = new Promise((resolve, reject) => {
        resolve({"resolve": false});
        reject({"reject": false});

      });
    }
    return result;
  }

  initMap(params) {
    let mapOptionsConfiguration = this.getConfigurationGoogleMaps(params);
    let elementInitMap;
    this.zone = new NgZone({enableLongStackTrace: false});
    elementInitMap = params.elementInitMap;
    let mapOptions: GoogleMapOptions = mapOptionsConfiguration;
    let mapElement;//current obj googlemaps
    mapElement = document.getElementById(elementInitMap);
    let mapInit;
    mapInit = this.googleMaps.create(mapElement, mapOptions);
    return mapInit;
  }

  setObjectMap(type, map) {
    if (type == 0) {//wulpy
      this.map = map;
    } else if (type == 1) {//contact
      this.mapContact = map;

    }
    else if (type == 2) {//contact
      this.mapContactDetails = map;

    }
    else if (type == 3) {//contact
      this.mapManager = map;

    }
    else if (type == 4) {//contact
      this.mapContactManagement = map;

    }
  }

  getParamsInitMap(typeMap) {
    let params = {
      elementInitMap: this.getElementInitObjectMap(typeMap),
      mapInitCurrent: this.getObjectMap(typeMap)
    };
    return params;
  }

  getElementInitObjectMap(type) {
    if (type == 0) {//wulpy

      return this.elementInitMap;

    } else if (type == 1) {//contact
      return this.elementInitMapContact;
    }
    else if (type == 2) {//business-details
      return this.elementInitMapContactDetails;

    }
    else if (type == 3) {//business-details
      return this.elementInitMapManager;

    }
    else if (type == 4) {//business-details
      return this.elementInitMapContactManagement;

    }
  }

  getObjectMap(type) {
    if (type == 0) {//wulpy
      return this.map;
    } else if (type == 1) {//contact
      return this.mapContact;

    }
    else if (type == 2) {//business-details
      return this.mapContactDetails;

    }
    else if (type == 3) {//business-details
      return this.mapManager;

    }
    else if (type == 4) {//business-details
      return this.mapContactManagement;

    }
  }


  initGoogleMap(params): Observable<any> {
    let mapInitCurrent = params.mapInitCurrent;
    return new Observable(observer => {
      if (mapInitCurrent) {
        let allowNavigation = false;
        /* if(currentPageNavigation){*/
        if (mapInitCurrent.getVisibleRegion()) {
          mapInitCurrent.remove().then(result => {
            let mapInit = this.initMap(params);
            allowNavigation = true;
            observer.next({management: true, mapInit: mapInit, managementDelete: true});
            observer.complete();
          }, error => {

            return null;
          });
        } else {
          let mapInit = this.initMap(params);
          allowNavigation = true;
          observer.next({management: true, mapInit: mapInit, managementDelete: false});
          observer.complete();
        }
      } else {
        let mapInit = this.initMap(params);
        observer.next({management: true, mapInit: mapInit});
      }
    });


  }

  getInitEventMapReady(mapCurrent): Observable<any> {
    return mapCurrent.on(GoogleMapsEvent.MAP_READY);
  }

  initEventsGoogleMaps(mapInit, params = null) {
    this.events.subscribe('map:block', (bloquar: boolean) => {
      if (mapInit) {
        mapInit.setClickable(!bloquar);
      }
    });

    mapInit.on(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(() => {
      this.toggleTrans(true);
    });

    mapInit.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
      this.toggleTrans(false);
    });

  }

  getDetailsSubcategoryById(business_subcategory_id) {


    let urlIcon = "https://trello-attachments.s3.amazonaws.com/58d5753472df21715e90fea4/5a51399ee3319a6d6a001471/68566d0cf4979f0a68ed22de6833dbb6/vineria.png";
    /* COMIDA $ BEBIDA*/
    let name = "S/SC";
    if (business_subcategory_id == 1) {
      urlIcon = "assets/app/markers/restaurants.png";
      name = "Restaurante";
    } else if (business_subcategory_id == 2) {
      urlIcon = "assets/app/markers/bares.png";
      name = "Bar";

    }
    else if (business_subcategory_id == 3) {
      urlIcon = "assets/app/markers/cafeterias.png";
      name = "Cafeteria";

    }

    /* QUE HACER*/

    else if (business_subcategory_id == 4) {
      urlIcon = "assets/app/markers/parques.png";
      name = "Parque";

    }
    else if (business_subcategory_id == 5) {
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Gimnasio";

    }
    else if (business_subcategory_id == 6) {//galeria de arte //not empty
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Galeria de Arte";

    }
    else if (business_subcategory_id == 7) {
      urlIcon = "assets/app/markers/parques_de_diversion.png";
      name = "Atracciones";

    }
    else if (business_subcategory_id == 8) {//not empty
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Musica en vivo";

    }
    else if (business_subcategory_id == 9) {
      urlIcon = "assets/app/markers/cine.png";
      name = "Cine";

    }
    else if (business_subcategory_id == 10) {
      urlIcon = "assets/app/markers/museo.png";
      name = "Museo";

    }
    else if (business_subcategory_id == 11) {//biblioteca not empty
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Biblioteca";

    }
    /* COMPRAS*/
    else if (business_subcategory_id == 12) {//tiendas de vivers not empty
      urlIcon = "assets/app/markers/minimarkets.png";
      name = "Tienda de Viveres";

    }
    else if (business_subcategory_id == 13) {//cosmeticos not empty
      urlIcon = "assets/app/markers/minimarkets.png";
      name = "Cosmeticos";

    }
    else if (business_subcategory_id == 14) {//concesionaria de autos not empty
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Concesionario de Autos";

    }
    else if (business_subcategory_id == 15) {// hogar y jardin
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Hogar & Jardin";

    }
    else if (business_subcategory_id == 16) {
      urlIcon = "assets/app/markers/ropa.png";
      name = "Almacen de Ropa";

    }
    else if (business_subcategory_id == 17) {//centro comercial empty
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Centro Comercial";

    }
    else if (business_subcategory_id == 18) {
      urlIcon = "assets/app/markers/electrodomesticos.png";
      name = "Electrodomesticos";

    }
    else if (business_subcategory_id == 19) {
      urlIcon = "assets/app/markers/supermercados.png";
      name = "Supermercado";

    }
    else if (business_subcategory_id == 20) {//mercado
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Mercado";

    }
    /* SERVICIOS*/
    else if (business_subcategory_id == 21) {
      urlIcon = "assets/app/markers/hoteles.png";
      name = "Hotel";

    }
    else if (business_subcategory_id == 22) {//cajero automatico
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Cajero Automatico";

    }
    else if (business_subcategory_id == 23) {//salon de belleza
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Salon de Belleza";

    }
    else if (business_subcategory_id == 24) {
      urlIcon = "assets/app/markers/renta_d_autos.png";
      name = "Renta de Carros";

    } else if (business_subcategory_id == 25) {//lavdo en seco
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Lavado en Seco";

    } else if (business_subcategory_id == 26) {//gas acopio
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Gas";

    } else if (business_subcategory_id == 27) {
      urlIcon = "assets/app/markers/clinicas_u_hospitales.png";
      name = "Hospitales & Clinicas";

    } else if (business_subcategory_id == 28) {//librerias
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Librerias";

    } else if (business_subcategory_id == 29) {//correo envios
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Correo & Envio";

    } else if (business_subcategory_id == 30) {//estacionamiento de carros
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Estacionamiento de Carros";

    } else if (business_subcategory_id == 31) {//asocioacon
      urlIcon = "assets/app/markers/gimnasio.png";
      name = "Asociacion";
    }
    let result = {
      url: urlIcon,
      name: name
    }
    return result;
  }


  getConfigIconCustom(business_subcategory_id) {
    let markerIcon = {
      url: this.getDetailsSubcategoryById(business_subcategory_id).url,
      size: {
        width: 35,
        height: 47,
      }
    }

    return markerIcon;
  }

  getConfigurationClickMarker(target) {
    let config = {
      target: target,
      zoom: 17,
      duration: 800
    };
    return config;
  }

  addMarker(params, mapCurrent) {
    if (mapCurrent) {
      let setParamsMarker = params;
      mapCurrent.addMarker(setParamsMarker).then((marker: Marker) => {
        // show the infoWindow
        marker.showInfoWindow();
        // If clicked it, display the alert
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((result) => {
          let target = result[0];
          let map = mapCurrent;
          map.animateCamera(this.getConfigurationClickMarker(target)).then(() => {
            if (params.alertConfig) {
              this.alert.showAlertPersonalice(params.alertConfig);
            }
            marker.showInfoWindow();
          });
        });
      });
    } else {
      this.alert.showWithTitle("Error", "Al añadir un marker");
    }
  }


  getConfigurationGoogleMaps(params = null) {
    let lat = this.latCurrent;
    let lng = this.lngCurrent;
    if (params) {
      if (params.position) {
        lat = params.position.lat;
        lng = params.position.lng;
      }

    }
    let mapOptions = {
      camera: {
        target: {
          lat: lat,
          lng: lng
        },
        zoom: 10,
      },
      controls: {
        myLocationButton: false,
        compass: false,
        mapToolbar: false
      },
      preferences: {
        padding: {

          bottom: 60
        },
      },
      styles: this.getStylesMap()
    }
    return mapOptions;
  }


  toggleTrans(active) {
    this.zone.run(() => {
      this.classTransActive = active;
    });
  }

  getPositionCurrent(): Observable<any> {
    let result = Observable.create(observer => {
      let currentPosition = {lat: this.latCurrent, lng: this.lngCurrent};
      observer.next(currentPosition);
    });

    return result;
  }


  addMakerPymesManagement(markersDataRows, mapInit) {
    let markersData = [];
    markersData = markersDataRows;
    let itemsMarker = [];
    for (let marker in markersData) {

      let businessData = markersData[marker];
      businessData["keyManagement"] = marker;
      businessData["discount_price"] = 0;
      businessData["businesss_price"] = 0;
      let latCurrent = parseFloat(businessData["street_lat"]);
      let lngCurrent = parseFloat(businessData["street_lng"]);
      let typeView = 0;

      let address = businessData["street_1"] + (businessData["street_2"] ? " y " + businessData["street_2"] : "");
      let message = "Dirección:" + address + "<br>";
      message += " Telefono: " + businessData["phone_value"] + "<br>";
      message += businessData["description"] ? +"Informacion<br>" + businessData["description"] : "";

      let category_name = this.getDetailsSubcategoryById(businessData["business_subcategory_id"]).name;
      businessData["category_name"] = category_name;
      let title = category_name + " - " + businessData["title"];
      let alertConfig = {
        title: title,
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              mapInit.animateCamera({
                target: mapInit.getCameraPosition().target,
                zoom: 10,
                duration: 500
              }).then(() => {

              });

            }
          },
          {
            text: 'Ver',
            handler: () => {
              this.dataManagerPages.viewBusinessDetails({
                page: this.dataManagerPages.getPageObjByType("business-details"),
                params: {data: businessData, typeView: typeView},
                typeView: typeView
              })
            }
          }
        ]
      };
      let business_subcategory_id = businessData["business_subcategory_id"];
      let pushMakerCluster;
      let paramsSet = {
        managementKey: marker,
        title: businessData["title"],
        icon: this.getConfigIconCustom(business_subcategory_id),
        animation: "DROP",
        position: {
          lat: latCurrent,
          lng: lngCurrent
        },
        alertConfig: alertConfig,
        itemManagement: marker,
        message: message,
        /* 'snippet': "Tap here!",*/
        /* 'styles': {
           'text-align': 'center',
           'font-style': 'italic',
           'font-weight': 'bold',
           'color': 'red'
         },*/
      };
      pushMakerCluster = {
        position: {
          lat: latCurrent,
          lng: lngCurrent
        }
      };
      /*this.addMarker(paramsSet, mapInit);*/
      itemsMarker.push(paramsSet);
    }
    this.googleMapsCluster.setDistributionCluster(itemsMarker, mapInit)

  }

  getStylesMap() {
    let result;
    result = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "saturation": 100
          },
          {
            "weight": 8
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": 3
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#eceaf0"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#eceaf0"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#37610c"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#dfe9e7"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#227021"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#beb3fa"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ];
    return result;
  }
}
