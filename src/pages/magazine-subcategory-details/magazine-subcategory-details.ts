import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {AlertProvider} from "../../providers/alert/alert";
import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";
/**
 * Generated class for the MagazineSubcategoryDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-magazine-subcategory-details',
  templateUrl: 'magazine-subcategory-details.html',
})
export class MagazineSubcategoryDetailsPage {
  public title: string = "Subcategorias";
  public dataCategories = [];

  static get parameters() {
    return [
      [NavController],
      [NavParams],
      [ConfigProvider],
      [LoadingProvider],
      [SharedDataProvider],
      [AlertProvider],
      [Platform],
      [ModalController],
      [DataManagerPagesProvider],
    ];
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public config: ConfigProvider,
              public loading: LoadingProvider,
              public shared: SharedDataProvider,
              public alert: AlertProvider,
              public platform: Platform,
              public modalCtrl: ModalController,
              public dataManagerPages: DataManagerPagesProvider,
) {
    this.dataCategories = navParams.get('data');
    this.initGetData();
  }

  initGetData() {
    this.platform.ready().then(() => {

    });
  }



  openGallerySubCategory(subcategoryData) {
    this.navCtrl.push(this.dataManagerPages.getPageObjByType("magazine-subcategory-carousel"), {data: subcategoryData});
  }
}
