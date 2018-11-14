// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
/*import {LocalNotifications} from "@ionic-native/local-notifications";*/
import {Storage} from '@ionic/storage';
import {Platform} from "ionic-angular";
/*import {OneSignal} from "@ionic-native/onesignal";*/

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {GoogleMap} from "@ionic-native/google-maps";

@Injectable()

export class ConfigProvider {
  /* ------------MAPS---------*/
  public map;
  public mapContact
  public mapContactManagement;
  public mapManager;
  public mapContactDetails;

  public currentUserLogin;
  public statusNetwork: boolean = false;//false=offline,true=online
  public pageAfter: string;
  public pageBefore: string;
  public keyUser: string = null;
  public typeLogin = "firebase";
  public dataGlobal: string = "Hola";
  public appUploadAppStore: boolean = false;
  public ipServer: boolean = true;
  public url: string = this.ipServer ? "http://18.231.29.97/" : 'http://54.207.105.228/';
  public urlFirebase = "";
  public langId: string = localStorage.langId;
  public loader = 'dots';
  public newProductDuration = 100;
  public cartButton = 1;//1 = show and 0 = hide
  public currency = "$";
  public currencyPos = "left";
  public paypalCurrencySymbol = 'USD';
  public address = "Calle Piedrahita y Buenos Aires - Otavalo";
  public fbId;
  public email = "kalexmiguelalba@gmail.com";
  public latitude = -78.2628514;
  public longitude = 0.2221273;
  public phoneNo = "0980216982";
  public pushNotificationSenderId;
  public lazyLoadingGif;
  public notifText;
  public notifTitle;
  public notifDuration;
  public footerShowHide;
  public homePage = 1;
  public categoryPage = 1;
  public siteUrl = '';
  public appName = '';
  public packgeName = "";
  public introPage = 1;
  public myOrdersPage = 1;
  public newsPage = 1;
  public wishListPage = 1;
  public shippingAddressPage = 1;
  public aboutUsPage = 1;
  public contactUsPage = 1;
  public editProfilePage = 1;
  public settingPage = 1;
  public admob = 0;
  public admobBannerid = '';
  public admobIntid = '';
  public admobIos = 1;
  public admobBanneridIos = '';
  public admobIntidIos = '';
  public googleAnalaytics = "";
  public rateApp = 1;
  public shareApp = 1;
  public fbButton = 0;
  public googleButton = 0;
  public notificationType = "";
  public onesignalAppId = "ce262dc7-fbab-482b-84d2-624e86e96174";
  public onesignalSenderId = "524834923805";
  public rewardRunning = 0;

  constructor(public http: Http,
              private storage: Storage,
              public platform: Platform,
              /*  private oneSignal: OneSignal,
                private localNotifications: LocalNotifications,*/
  ) {
  }

  public siteSetting() {
    return new Promise(resolve => {
      this.http.get(this.url + 'siteSetting').map(res => res.json()).subscribe(data => {
        var settings = data.data[0];
        this.fbId = settings.facebook_app_id;
        this.address = settings.address + ', ' + settings.city + ', ' + settings.state + ' ' + settings.zip + ', ' + settings.country;
        this.email = settings.contact_us_email;
        this.latitude = settings.latitude;
        this.longitude = settings.longitude;
        this.phoneNo = settings.phone_no;
        this.pushNotificationSenderId = settings.fcm_android_sender_id;
        this.lazyLoadingGif = settings.lazzy_loading_effect;
        this.newProductDuration = settings.new_product_duration;
        this.notifText = settings.notification_text;
        this.notifTitle = settings.notification_title;
        this.notifDuration = settings.notification_duration;
        this.currency = settings.currency_symbol;
        this.cartButton = settings.cart_button;
        this.footerShowHide = settings.footer_button;
        this.setLocalNotification();
        this.appName = settings.app_name;
        this.homePage = settings.home_style;
        this.categoryPage = settings.category_style;
        this.siteUrl = settings.site_url;
        this.introPage = settings.intro_page;
        this.myOrdersPage = settings.my_orders_page;
        this.newsPage = settings.news_page;
        this.wishListPage = settings.wish_list_page;
        this.shippingAddressPage = settings.shipping_address_page;
        this.aboutUsPage = settings.about_us_page;
        this.contactUsPage = settings.contact_us_page;
        this.editProfilePage = settings.edit_profile_page;
        this.packgeName = settings.package_name;
        this.settingPage = settings.setting_page;
        this.admob = settings.admob;
        this.admobBannerid = settings.ad_unit_id_banner;
        this.admobIntid = settings.ad_unit_id_interstitial;
        this.googleAnalaytics = settings.google_analytic_id;
        this.rateApp = settings.rate_app;
        this.shareApp = settings.share_app;
        this.fbButton = settings.facebook_login;
        this.googleButton = settings.google_login;
        this.notificationType = settings.default_notification;
        this.onesignalAppId = settings.onesignal_app_id;
        this.onesignalSenderId = settings.onesignal_sender_id;
        this.admobIos = settings.ios_admob;
        this.admobBanneridIos = settings.ios_ad_unit_id_banner;
        this.admobIntidIos = settings.ios_ad_unit_id_interstitial;
        this.rewardRunning = data.data.reward_running ? data.data.reward_running.rewards_amount : 0;
        resolve();
      });
    });
  }

  //Subscribe for local notification when application is start for the first time
  setLocalNotification() {
    this.platform.ready().then(() => {
      this.storage.get('localNotification').then((val) => {
        if (val == undefined) {
          this.storage.set('localNotification', 'localNotification');
          /* this.localNotifications.schedule({
             id: 1,
             title: this.notifTitle,
             text: this.notifText,
             every: this.notifDuration,
           });*/
        }
      });
    });
  }


}

export const ChatAnimations = {
  opacity_out: 0,
  opacity_in: 0,
  translateY_out: '40px',
  translateY_in: '-40px',
  time_out: '0.3s',
  time_in: '0.3s',

}
export const chatAnimationsChatLogin = {
  //leave Login
  animateLeave: 'md-transition',//md-transition, wp-transition
  timeAnimateLeave: 800,
  //enter Login
  animateIn: 'animation--Down' //amimation--Down, amimation--Back


}


export const CHAT_ENGINE = {
  publishKey: 'pub-c-397bb15e-3b90-4d1f-a2db-9f533b39381f',
  subscribeKey: 'sub-c-c6f550e2-74ac-11e8-902b-b2b3cb3accda'
}
export const FactorRunning = {
  distanceFactor: 1.142241,
  caloriesFactor: 0.11977
}
export const sensors = {
  pedometer: 'pedometer',
  google: 'google',
  accelerometer: 'accelerometer'
}
