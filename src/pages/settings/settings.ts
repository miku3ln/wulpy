// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, Events, Platform, IonicPage} from 'ionic-angular';
/*import { LocalNotifications } from '@ionic-native/local-notifications';*/
import {ConfigProvider} from '../../providers/config/config';
import {Storage} from '@ionic/storage';
import {Http} from '@angular/http';
import {LoadingProvider} from '../../providers/loading/loading';
import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";
import {BranchIoManagementProvider} from "../../providers/branch-io-management/branch-io-management";
import {AlertController} from 'ionic-angular';

/*-----SERVICES---*/
import {AppSettings} from '../../services/app-settings';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Observable} from "rxjs/Observable";
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  setting: { [k: string]: any } = {};

  static get parameters() {
    return [
      [NavController],
      [NavParams],
      [ModalController],
      [ConfigProvider],
      [Storage],
      [LoadingProvider],
      [Http],
      [Events],
      [SharedDataProvider],
      [Platform],
      [DataManagerPagesProvider],
      [BranchIoManagementProvider],
      [AlertController],
      [SocialSharing]
    ];
  }

  linkShareBUO: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public config: ConfigProvider,
    private storage: Storage,
    public loading: LoadingProvider,
    public http: Http,
    public events: Events,
    public shared: SharedDataProvider,
    /*private localNotifications: LocalNotifications,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private appVersion: AppVersion,*/
    public plt: Platform,
    public dataManagerPages: DataManagerPagesProvider,
    public branchIoManagement: BranchIoManagementProvider,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
  ) {

  }


  turnOnOffNotification(value) {
    if (this.setting.localNotification == false) {
      /*  this.localNotifications.cancel(1).then((result) => {
        });*/
    }
    else {
      /*      this.localNotifications.schedule({
              id: 1,
              title: this.config.notifTitle,
              text: this.config.notifText,
              every: this.config.notifDuration,
            });*/
    }

    this.updateSetting();
  }

  updateSetting() {
    console.log(this.setting);
    this.storage.set('setting', this.setting);
  }

  openLoginPage() {
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("login"));
    modal.present();
  }

  logOut() {
    this.shared.logOut();
  }

  openPage(page) {
    if (page == 'myAccount') this.navCtrl.push(this.dataManagerPages.getPageObjByType("my-account"));
  }

  openSite() {
    this.loading.autoHide(2000);
    /*this.iab.create(this.config.siteUrl, "blank");*/
  }

  //============================================================================================
  //turning on off local  notification
  onOffPushNotification() {
    this.storage.get('registrationId').then((registrationId) => {
      var data: { [k: string]: any } = {};
      data.device_id = registrationId;
      /*   if (this.setting.notification == false) data.is_notify = 0;
         else data.is_notify = 1;
         this.http.post(this.config.url + 'notify_me', data).map(res => res.json()).subscribe(data => {
           if (data.success == 1) {

             this.updateSetting();
           }
         }, function (response) {
           console.log(response);
         });*/
    });
  };

  hideShowFooterMenu() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }

  hideShowCartButton() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }

  showModal(value) {
    this.loading.autoHide(1000);
    if (value == 'privacyPolicy') {
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("privacy-policy"));
      modal.present();
    }
    else if (value == 'termServices') {
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("term-services"));
      modal.present();
    }
    else if (value == 'language') {
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("language"));
      modal.present();
    }
    else {
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("refund-policy"));
      modal.present();
    }
  }

  ionViewDidLoad() {
    /*this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting = val;

      }
      else {
        this.setting.localNotification = true;
        this.setting.notification = true;
        this.setting.cartButton = true;
        this.setting.footer = true;
      }
    });*/
  }

  openCart() {
    /*this.navCtrl.push(CartPage);*/
  }

  openSearch() {
    /*  this.navCtrl.push(SearchPage);*/
  }

  rateUs() {
    /* this.loading.autoHide(2000);
     if (this.plt.is('ios')) {
      /!* this.iab.create(this.config.packgeName.toString(), "_system");*!/
     } else if (this.plt.is('android')) {
    /!*   this.appVersion.getPackageName().then((val) => {
         this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
       });*!/
     }*/
  }

  share() {
    /*this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      /!*this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });*!/
    } else if (this.plt.is('android')) {

      /!*this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });*!/
    }*/
    this.initShareByManagement();

  }

  showAd() {
    this.loading.autoHide(2000);
    this.events.publish('showAd');
  }

  getParamsPDLAByPage(page, linkShareBUO = false) {
    let params: any;
    switch (page) {
      case 'newest': {
        if (linkShareBUO) {
          params = [page, '{"sortOrder":' + page + '"}']
        } else {
          params = {
            page: page,
            paramsSortOrder: page
          };
        }

        break;
      }
      case 'home': {

        if (linkShareBUO) {
          params = [page]
        } else {
          params = {
            page: page,
          };
        }
        break;
      }
      case 'categories': {

        if (linkShareBUO) {
          params = [page]

        } else {
          params = {
            page: page,
          };
        }
        break;
      }
      case 'productDetail': {
        if (linkShareBUO) {
          params = [page, '{"id":"producto_id"}']

        } else {
          params = {
            page: page,
            paramsProduct_id: "producto_id"
          };
        }


        break;
      }
      case 'advertising': {
        if (linkShareBUO) {
          params = [page]

        } else {
          params = {
            page: page
          };
        }
        break;
      }

    }
    return params;
  }


  getBranchUniversalObj(params): Observable<any> {

    let typeShare = params.typeShare;
    let paramsCurrent = params.params;

    let that = this;
    let analytics = this.branchIoManagement.getAnalyticsByType(typeShare, paramsCurrent);
    let propertiesShort = this.branchIoManagement.getPropertiesShortUrlByType(typeShare, paramsCurrent);
    return new Observable(observer => {
      // create a branchUniversalObj variable to reference with other Branch methods
      let branchUniversalObj = null
      let share_deep_link;
      this.branchIoManagement.createBranchUniversalObject(
        this.branchIoManagement.getPropertiesByType(typeShare, paramsCurrent)
      ).then((res) => {
        branchUniversalObj = res;
        share_deep_link = branchUniversalObj;
        branchUniversalObj.generateShortUrl(
          analytics,
          propertiesShort
        ).then((res) => {

          let result = {
            content_reference: branchUniversalObj,
            share_deep_link: share_deep_link,
            urls: {
              0: {url: res.url}
            }
          };
          observer.next(result);
          observer.complete();
        }).catch((err) => {
          alert('Error: generateShortUrl ' + JSON.stringify(err));
        });
      }).catch((err) => {
        alert('Error: content_reference ' + JSON.stringify(err));
      })
    });


  }

  initEventsShare(branchUniversalObj, analytics, properties) {


// optional listeners (must be called before showShareSheet)
    branchUniversalObj.onShareSheetLaunched(function (res) {
      // android only
      console.log(res)
    })
    branchUniversalObj.onShareSheetDismissed(function (res) {
      console.log(res)
    })
    branchUniversalObj.onLinkShareResponse(function (res) {
      console.log(res)
    })
    branchUniversalObj.onChannelSelected(function (res) {
      // android only
      console.log(res)
    });

  }

  initShareByManagement(menuSome: boolean = false) {

    let that = this;

    let params = {
      typeShare: "app",
      params: {
        title: "WulpyEstodo App ",
        contentDescription: "Refiere y gana puntos al share la app , y empresas registradas.",
        tags: this.generateParamsTags()
      }
    };


    this.getBranchUniversalObj(params).subscribe(result => {
      let res = result;
      /*      let result = {
              content_reference: branchUniversalObj,
              share_deep_link: share_deep_link,
              urls: {
                0: {url: res.url}
              }
            };*/
      let urlLinkShare = res.urls["0"].url;
      let options = {
        message: "Hola te invitamos a descargarte nuestra app.",
        subject: "Wulpy es Todo",
        url: urlLinkShare,
        chooserTitle: "Invitacion para descargarte la app"
      };

      that.socialSharing.shareWithOptions(options).then(() => {
        // Sharing via email is possible
      }).catch(() => {
        // Sharing via email is not possible
      });
    }, error => {
      console.log("error--->");
    });


  }

  generateParamsTags() {
    //page
    //params
    //pay
    //uid-share
    //entityShare
    //entityShareKey
    let paramsPage = {};
    let stags = [];
    stags.push("home");
    let stringParamsPage = JSON.stringify(paramsPage);
    stags.push(stringParamsPage);
    stags.push(true);
    stags.push(this.config.keyUser);
    stags.push("app");
    stags.push("none");
    return stags;
  }
}
