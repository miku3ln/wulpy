import {AngularFireDatabase} from 'angularfire2/database';
import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings';
import {LoadingService} from './loading-service';
import {DataManagerPagesProvider} from "../providers/data-manager-pages/data-manager-pages";

@Injectable()
export class MenuService {
  constructor(
    public af: AngularFireDatabase,
    private loadingService: LoadingService,
    public dataManagerPages: DataManagerPagesProvider,
  ) {
  }

  getId = (): string => 'menu';
  getTitle = (): string => 'UIAppTemplate';
  getAllMenuManagement = (): Array<any> => {
    return [

      {
        "title": "Inicio",
        "theme": "register",
        "icon": "home",
        "init-session": true,
        "listView": false,
        "component": this.dataManagerPages.getPageObjByType("home-management")
      },
      {
        "title": "Galería",
        "theme": "register",
        "icon": "images",
        "listView": false,
        "init-session": true,
        "component": this.dataManagerPages.getPageObjByType("file-manager")
      },
      {
        "title": "Quienes Somos",
        "theme": "register",
        "icon": "information-circle",
        "listView": false,
        "init-session": true,
        "component": this.dataManagerPages.getPageObjByType("about-us-management")
      },
  /*    {
        "title": "Servicios",
        "theme": "register",
        "icon": "paper",
        "init-session": true,
        "listView": false,
        "component": this.dataManagerPages.getPageObjByType("services-management")
      },*/
      {
        "title": "Contáctanos",
        "theme": "parallax",
        "icon": "call",
        "listView": false,
        "init-session": true,
        "component": this.dataManagerPages.getPageObjByType("contact-us-management")
      },

    ];
  };

  getDataForTheme = (menuItem: any) => {
    return {
      "background": "assets/images/background/16.jpg",
      "image": "assets/images/logo/login.png",
      "title": "Ionic3 UI Theme - Yellow Dark"
    };
  };

  getEventsForTheme = (menuItem: any): any => {
    return {};
  };

  prepareParams = (item: any) => {
    return {
      title: item.title,
      data: {},
      events: this.getEventsForTheme(item)
    };
  };

  load(item: any,statusNetwork:boolean=false): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(item,statusNetwork);
    } else {
      return this.getDataByStatusNetwork(item, false);
    }

  }

  getDataByStatusNetwork(item, status) {
    if (status) {
      return new Observable(observer => {
        this.af
          .object('menu')
          .valueChanges()
          .subscribe(snapshot => {
            /*that.loadingService.hide();*/
            observer.next(snapshot);
            observer.complete();
          }, err => {
            /* that.loadingService.hide();*/
            observer.error([]);
            observer.complete();
          });
      });
    } else {
      return new Observable(observer => {
        /* that.loadingService.hide();*/
        observer.next(this.getDataForTheme(item));
        observer.complete();
      });
    }


  }

}
