import {Injectable, ViewChild} from '@angular/core';
import {ConfigProvider} from '../../providers/config/config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import {count} from "rxjs/operator/count";
/*----------PAGES TEMPLATE----*/


import {ForgotPasswordPage} from '../../pages/forgot-password/forgot-password';
import {SettingsPage} from '../../pages/settings/settings';
import {MyAccountPage} from "../../pages/my-account/my-account";
/*import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';*/
import {PrivacyPolicyPage} from '../../pages/privacy-policy/privacy-policy';
import {TermServicesPage} from '../../pages/term-services/term-services';
import {RefundPolicyPage} from '../../pages/refund-policy/refund-policy';
import {AlertController, Events, ModalController, Nav, NavController, NavParams, Platform} from "ionic-angular";
import {FileManagerPage} from "../../pages/file-manager/file-manager";
import {CategoryPage} from "../../pages/category/category";
import {SubcategoryPage} from "../../pages/subcategory/subcategory";
import {GalleryManagementPage} from "../../pages/gallery-management/gallery-management";
import {MagazineManagementPage} from "../../pages/magazine-management/magazine-management";
import {MagazineSubcategoryDetailsPage} from "../../pages/magazine-subcategory-details/magazine-subcategory-details";
import {MagazineSubcategoryCarouselPage} from "../../pages/magazine-subcategory-carousel/magazine-subcategory-carousel";

import {HomeManagementPage} from "../../pages/home-management/home-management";
import {ContactUsManagementPage} from "../../pages/contact-us-management/contact-us-management";

@Injectable()
export class DataManagerPagesProvider {
  private apiUrlBackend: string;
  public nav;
  public modal;
  public modalCtrl;
  public navCurrent;
  public managementPages = true;

  static get parameters() {
    return [
      [HttpClient],
      [ConfigProvider],
    ];
  }

  constructor(public http: HttpClient, public config: ConfigProvider, public currentNav: NavController,
  ) {
    this.apiUrlBackend = this.config.url;
    console.log("currentNav", currentNav, "nav", this.nav);
    this.navCurrent = currentNav;
    console.log("init", this.navCurrent);

  }

  getPageObjByType(page) {
    let result;
    switch (page) {
      case "home":
        if (this.managementPages) {
          result = "HomeManagementPage";
        }
        break;
      case "list":
        result = "ListPage";
        break;
      case "setting":
        result = "SettingsPage";
        break;
      case "language":
        result = "LanguagePage";
        break;
      case "my-account":
        result = "MyAccountPage";
        break;
      case "term-services":
        result = "TermServicesPage";
        break;
      case "refund-policy":
        result = "RefundPolicyPage";
        break;
      case "privacy-policy":
        result = "PrivacyPolicyPage";
        break;
      case "intro":
        break;
      case "business-details":

        break;
      case "file-manager":
        result = "FileManagerPage";
        break;
      case "category":
        result = "CategoryPage";
        break;
      case "subcategory":
        result = "SubcategoryPage";
        break;
      case "gallery-management":
        result = "GalleryManagementPage";
        break;
      case "magazine-management":
        result = "MagazineManagementPage";
        break;
      case "magazine-subcategory-carousel":
        result = "MagazineSubcategoryCarouselPage";
        break;
      case "magazine-subcategory-details":
        result = "MagazineSubcategoryDetailsPage";
        break;
      case "home-management":
        result = "HomeManagementPage";
        break;
      case "contact-us-management":
        result = "ContactUsManagementPage";
        break;
      case "about-us-management":
        result = "AboutUsManagementPage";
        break;
      case "about-us-item-management":
        result = "AboutUsItemManagementPage";
        break;
    }
    return result;
  }

  viewBusinessDetails(params) {

    let typeView = params.typeView;
    if (typeView) {//modal
      let modal = this.modalCtrl.create(params.page, params.params);
      modal.present();
    } else {
      this.nav.push(params.page, params.params);

    }
  }


}
