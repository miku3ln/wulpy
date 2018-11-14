import {Component, ElementRef, ViewChild} from '@angular/core';
import {Events, Platform, MenuController, Nav, ModalController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AppSettings} from '../services/app-settings';
import {IService} from '../services/IService';
import {DataManagerPagesProvider} from '../providers/data-manager-pages/data-manager-pages';
import {SharedDataProvider} from "../providers/shared-data/shared-data";
import {ConfigProvider, sensors} from '../providers/config/config';
import {Network} from "@ionic-native/network";
import {ConfigDataFirebaseProvider} from "../providers/config-data-firebase/config-data-firebase";
import {SplashPage} from "../pages/splash/splash";
import {timer} from 'rxjs/observable/timer';
import {ConnectivityService} from '../services/connectivity-service';
import {LoadingProvider} from '../providers/loading/loading';
//Branch io
import {BranchIoManagementProvider} from '../providers/branch-io-management/branch-io-management';
import {Observable} from "rxjs/Observable";
import {MenuService} from "../services/menu-service";
import {UsersService} from "../services/user-service";
import {AlertProvider} from "../providers/alert/alert";

@Component({
  templateUrl: 'app.html',
  providers: [
    MenuService,
    UsersService,
    DataManagerPagesProvider,
    AlertProvider,
    SharedDataProvider,
    LoadingProvider,
    ConfigDataFirebaseProvider,
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public splashLoadClass: string = "element-view";
  @ViewChild('splashLoad') myImage: ElementRef;

  public connectivityState: false;
  rootPage = "LoginManagementPage";
  pages: any;
  params: any;
  leftMenuTitle: string;
  showSplash = true; // <-- show animation
  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public dataManagerPages: DataManagerPagesProvider,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public events: Events,
    public network: Network,
    public configDataFirebase: ConfigDataFirebaseProvider,
    public connnectivity: ConnectivityService,
    public branchIoManagement: BranchIoManagementProvider,
    public loading: LoadingProvider,
    private menuService: MenuService,
    public userService: UsersService,
  ) {
    this.pages = [];
    this.splashScreen.hide();
    this.platform.ready().then(() => {
      this.initEventsEmitApp();
      this.config.statusNetwork = this.connnectivity.isOnline();
      this.dataManagerPages.nav = this.nav;
      this.dataManagerPages.modalCtrl = modalCtrl;
      this.initEventsNetwork();
      this.initEventsDeepLink();
      this.splashLoadClass = "element-hide";
      if (AppSettings.SHOW_START_WIZARD) {
        this.presentProfileModal();
      }
      this.getInfoUser().subscribe(data => {
          console.log("getInfoUser subscribe");
          let loginUser = false;
          if (data.success) {//ALL OK login
            let userCurrent = data.userCurrent;
            this.config.currentUserLogin = userCurrent;
            let customer_data = data.customer_data;
            this.shared.login(customer_data);
            let customerDataWulpyms = data.customerDataWulpyms;
            this.shared.customerDataWulpyms = customerDataWulpyms;
            let keyUser = data.keyUser;
            this.config.keyUser = keyUser;
            loginUser = true;
            this.rootPage = "HomeManagementPage";
            this.splashLoadClass = "element-hide";

          } else {
            this.rootPage = "LoginManagementPage";
            this.splashLoadClass = "element-hide";

          }
          this.pages = this.getMenuItemsUser(loginUser);
          this.initializeApp();
          this.initSplashEvents(true);
        }, error1 => {
          this.splashLoadClass = "element-hide";
          console.log("error su");
        }, () => {
          this.splashLoadClass = "element-hide";
          console.log("complete");

        }
      );
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoadInit");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnterInit");

  }

  ionViewDidEnter() {
    console.log("ionViewDidEnterInit");

  }

  ionViewWillLeave() {
    console.log("ionViewWillLeaveInit");

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

  initSplashEvents(allow) {
    if (allow) {
      this.showSplash = true;
    } else if (!allow) {
      this.showSplash = false;
    }

  }

  initializeApp() {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    localStorage.setItem("mailChimpLocal", "true");
  }

  initGetDataServices() {

  }

  initEventsNetwork() {

  }

  initEventsDeepLink() {
    // Branch initialization

    // only on devices
    if (!this.platform.is("cordova")) {
      return;
    }
    this.branchIoManagement.initBranchIoSession().then(data => {
      this.branchIoManagement.dataSession = data;
      let getLink = this.branchIoManagement.getTypeLink(this.branchIoManagement.dataSession);
      this.initPageByTypeLink(getLink);
    }).catch(error => {
      console.log(error)
    });

  }

  initPageByTypeLink(typeLink) {

    if ("+clicked_branch_link" == typeLink || typeLink == true) {//abrir app by branch io DEEP LINK
      let pageInit = this.getParamsByTags(this.branchIoManagement.dataSession);
      if (pageInit) {
        let params = {
          //page
          //params
          //pay
          //uid-share
          //entityShare
          //entityShareKey
          dataSession: this.branchIoManagement.dataSession,
          page: pageInit["page"],
          params: pageInit["params"],
          "pay": pageInit["pay"],
          "uid-share": pageInit["uid-share"],
          "entityShare": pageInit["entityShare"],
          "entityShareKey": pageInit["entityShareKey"],

        };
        this.viewPageByParamsBranchIo(params);
      }
    } else if ("+non_branch_link" == typeLink) {
      console.log("+non_branch_link");
    }
    else if ("organically" == typeLink) {//cuando abre la aplicacion sin necesidad de branch io o background
      console.log("organically");

    }
  }

  getParamsByTags(dataSession) {
    //page
    //params
    //pay
    //uid-share
    //entityShare
    //entityShareKey
    if (dataSession["~tags"]) {
      return {
        page: dataSession["~tags"][0],
        params: JSON.parse(dataSession["~tags"][1]),
        "pay": dataSession["~tags"][2],
        "uid-share": dataSession["~tags"][3],
        "entityShare": dataSession["~tags"][4],
        "entityShareKey": dataSession["~tags"][5],

      };
    } else {
      return {
        page: null,
        params: {},
        "pay": null,
        "uid-share": null,
        "entityShare": null,
        "entityShareKey": null

      };
    }

  }

  viewPageByParamsBranchIo(params) {
    var page = params.page;
    switch (page) {
      case 'newest': {//with branch io params

        setTimeout(() => {
          let sortOrder = params.dataSession.paramsSortOrder;
          let paramsTags;
          if (params.dataSession["~tags"]) {
            paramsTags = JSON.parse(params.dataSession["~tags"][1]);
          }
          let paramsPage = {sortOrder: sortOrder};
          if (paramsTags) {
            paramsPage = paramsTags;
          }


        }, 2000);

        break;
      }
      case 'home': {
        setTimeout(() => {
          this.rootPage = this.dataManagerPages.getPageObjByType(page);
        }, 2000);
        break;
      }
      case 'business-details': {
        setTimeout(() => {
          let paramsCurrent = {"params": params.params, page: this.dataManagerPages.getPageObjByType(page)};
          this.dataManagerPages.viewBusinessDetails(paramsCurrent);
        }, 2000);
        break;
      }
      case 'productDetail': {
        setTimeout(() => {
          let id = params.dataSession.paramsProduct_id;
          let paramsTags = JSON.parse(params.dataSession["~tags"][1]);
          if (paramsTags) {
            id = paramsTags.id;
          }

        }, 2000);

        break;
      }
      case 'advertising': {//with methods app

        setTimeout(() => {
          this.openPage(page);


        }, 2000);
        break;
      }

    }
  }

  openPage(page) {
    if (page.singlePage) {
      this.menu.open();
      this.nav.push(this.getPageForOpen(page.theme), {
        service: this.getServiceForPage(page.theme),
        page: page,
        componentName: page.theme
      });
    } else {
      /*   this.nav.setRoot("ItemsPage", {
           componentName: page.theme
         });*/
      if (page.component) {
        this.nav.setRoot(page.component);
      }
      else if (page == 'settings') {
        this.nav.setRoot(this.dataManagerPages.getPageObjByType("setting"));
      }
    }


  }

  menuClosed() {
    this.events.publish('map:block', false);
  }

  menuOpened() {
    this.events.publish('map:block', true);
  }

  openLanguagePage() {
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("language"));
    modal.present();
  }

  openLoginPage() {
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("login"));
    modal.present();
  }

  openSignUpPage() {
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("sing-up"));
    modal.present();
  }

  logOut() {
    this.shared.logOut();
  }

  /*-----SERVICES---*/

  getPageForOpen(value: string): any {
    return null;
  }

  getServiceForPage(value: string): IService {
    return null;
  }

  presentProfileModal() {
    const profileModal = this.modalCtrl.create("IntroPage");
    profileModal.present();
  }

  /*------INIT APP SERVICES---*/
  getInfoUser(): Observable<any> {

    return new Observable(observer => {
      let statusNetwork = this.connnectivity.isOnline();
      this.configDataFirebase.getStateCurrentUser().subscribe(user => {
        let userCurrent = user;
        let keyUser;
        if (userCurrent) {
          keyUser = userCurrent.uid;
          this.userService.load(keyUser, statusNetwork).subscribe(dataUser => {
              let customer_data = this.configDataFirebase.getDataInformationUser(userCurrent, dataUser);
              let titleInfo = " Punto Acumulados";
              let points = 0;
              if (dataUser) {
                if (dataUser.wulpymsPoints) {
                  points = dataUser.wulpymsPoints.points ? dataUser.wulpymsPoints.points : 0;
                }
                titleInfo = points == 1 ? "Punto Acumulado" : "Puntos Acumulados";
                let resultNext = {
                  success: true,
                  managementAll: true,
                  customer_data: customer_data,
                  userCurrent: userCurrent,
                  keyUser: keyUser,
                  customerDataWulpyms: {
                    points: points,
                    title: titleInfo
                  }
                }
                observer.next(resultNext);
              }

            }, error => {
              let resultNext = {
                msj: "Error userService.load(keyUser)",
                error: error
              }
              observer.error(resultNext)
            }
          );
        } else {
          let resultNext = {
            success: false,
          }
          observer.next(resultNext);
        }
        this.configDataFirebase.setAuthState(userCurrent);
        this.config.keyUser = keyUser;
        /!*Information*!/
      })


    });

  }


  getMenuItemsUser(userLogin: boolean) {
    let menuAll = this.menuService.getAllMenuManagement();
    return menuAll.filter(function (value) {
      return (value["init-session"] == userLogin || value["init-session"] == false);
    });
  }

  initEventsEmitApp() {
    this.events.subscribe("init:map", (typeMap, eventName) => {
      console.log(typeMap, eventName);
    });
  }
}
