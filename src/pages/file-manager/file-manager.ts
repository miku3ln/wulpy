import {Component, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Content, FabButton, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';

/**
 * Generated class for the FileManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import 'rxjs/add/operator/map';
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {AlertProvider} from "../../providers/alert/alert";

import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";
import {CategoriesService} from "../../services/categories-service";
import {SubcategoriesService} from "../../services/subcategories-service";
import {FirebaseStorageService} from "../../services/firebase-storage";
import {AppSettings} from "../../services/app-settings";
import {GalleryManagementService} from "../../services/galery-management-service";

@IonicPage()
@Component({
  selector: 'page-file-manager',
  templateUrl: 'file-manager.html',
  providers: [

    CategoriesService, SubcategoriesService, FirebaseStorageService, GalleryManagementService,
    AlertProvider,]
})
export class FileManagerPage {
  public mapCurrent;
  public enableBtnChoose: boolean = false;
  public categories: any;
  public title: string = "Catálogos";
  public segments = {
    0: {name: "Categorias", value: "0"},
    1: {name: "Subcategorias", value: "1"},
  };
  public modelSegments = "0";
  /*---------DATA----------*/
  public dataCategories = [];
  public datasubCategories = [];
  public datasubCategoriesImages = [];
  public allowDeleteStorage = false;

  public data: any = {};
  public text = "alex";
  /*-------CONFIG DATA EXPANDABLE----*/
  public paramsDataManagementCategories: any = null;
  public paramsDataManagementSubCategories: any = null;
  @Output() emitEventsButtonsChildren = new EventEmitter<Object>();

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
      [CategoriesService],
      [SubcategoriesService],
      [FirebaseStorageService],
      [GalleryManagementService]
    ];
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public alert: AlertProvider,
    public platform: Platform,
    public modalCtrl: ModalController,
    public dataManagerPages: DataManagerPagesProvider,
    public categoriesService: CategoriesService,
    public subcategoriesService: SubcategoriesService,
    public serviceStorage: FirebaseStorageService,
    public galleryService: GalleryManagementService,
  ) {
  }

  ionViewDidLoad() {
    this.initGetData();
  }


  initGetData() {

    this.text = "HOola";
    this.platform.ready().then(() => {
      this.categoriesService.load().subscribe(dataRows => {
        this.initManagementViewValuesComponentCategory(dataRows);
      }, error => {
        console.log("error");
      });

      this.subcategoriesService.load().subscribe(dataRows => {
     
        this.initManagementViewValuesComponentSubCategory(dataRows);
      }, error => {
        console.log("error");

      });
      this.galleryService.loadAll().subscribe(dataRows => {
        this.datasubCategoriesImages = dataRows;
      }, error => {
        console.log("error");

      });

    });

  }


  viewManagementType() {
    if (this.modelSegments == "0") {
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("category"));
      modal.present();
    } else {


      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("subcategory"), {"datasubCategories": this.datasubCategories});
      modal.present();
    }
  }

  viewManagementUpdateType(type, params) {
    if (type) {
      let data = params;
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("category"), data);
      modal.present();
    } else {
      let data = params;
      let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("subcategory"), data);
      modal.present();
    }
  }

  editCategory(row) {
    let data = {data: row};
    data["data"]["keyRef"] = row["key"];
    this.viewManagementUpdateType(1, data);
  }

  removeCategory(row) {
    let key = row["key"];
    let auxDataSubCategories = this.datasubCategories;
    let childrenCategory = this.getDataChildrenCategory(key, auxDataSubCategories);
    this.loading.show();
    let categoriesPath = AppSettings.pathOrRef["categories"];
    let subCategoriesPath = AppSettings.pathOrRef["subcategories"];
    childrenCategory.forEach((value, index) => {
      if (this.allowDeleteStorage) {
        /*DELETE CHILDREN STORAGE IMAGE*/
        let fullPathStorage = value.fullPath;
        this.serviceStorage.removeDataStorage(fullPathStorage).then(result => {
          console.log("success removeDataStorage");
        }, error => {
          console.log("error removeDataStorage", error);
        });
      }
      /*DELETE CHILDREN DATABASE*/
      let fullPathDatabase = subCategoriesPath + "/" + value.key;
      this.serviceStorage.deleteFile({fullPath: fullPathDatabase}).then(result => {
        console.log("success deleteFile subcategoria");
      }, error => {
        console.log("error deleteFile subcategoria");
      });

    });
    /*DELETE CHILDREN DATABASE*/
    let fullPathDatabase = categoriesPath + "/" + key;
    this.serviceStorage.deleteFile({fullPath: fullPathDatabase}).then(result => {
      console.log("success deleteFile category");
    }, error => {
      console.log("error deleteFile category");
    });
    this.loading.hide();

  }

  getDataChildrenCategory(needle, haystack) {
    return haystack.filter(function (value) {
      return value.category_id == needle;
    });


  }

  editSubCategory(row) {
    let data = {data: row};
    data["data"]["keyRef"] = row["key"];
    data["datasubCategories"] = this.datasubCategories;
    this.viewManagementUpdateType(0, data);
  }

  removeSubCategory(row) {
    let key = row["key"];
    let auxDataSubCategoriesGallery = this.datasubCategoriesImages;
    let childrens = this.getDataChildrenSubCategory(key, auxDataSubCategoriesGallery, "key");
    this.loading.show();
    let subCategoriesPath = AppSettings.pathOrRef["subcategories"];
    let subCategoriesGalleryPath = AppSettings.pathOrRef["gallery"];
    childrens.forEach((value, index) => {
      if (this.allowDeleteStorage) {
        /*DELETE CHILDREN STORAGE IMAGE*/
        let fullPathStorage = value.fullPath;
        this.serviceStorage.removeDataStorage(fullPathStorage).then(result => {
          console.log("success removeDataStorage");
        }, error => {
          console.log("error removeDataStorage", error);
        });
      }
      /*DELETE CHILDREN DATABASE*/
      let fullPathDatabase = subCategoriesGalleryPath + "/" + value.key;
      this.serviceStorage.deleteFile({fullPath: fullPathDatabase}).then(result => {
        console.log("success deleteFile subCategoriesGalleryPath");
      }, error => {
        console.log("error deleteFile subCategoriesGalleryPath");
      });

    });
    /*DELETE CHILDREN DATABASE*/
    let fullPathDatabase = subCategoriesPath + "/" + key;
    this.serviceStorage.deleteFile({fullPath: fullPathDatabase}).then(result => {
      console.log("success deleteFile category");
    }, error => {
      console.log("error deleteFile category");
    });
    this.loading.hide();
  }

  addAlbum(row) {
    let data = {data: row};
    data["data"]["keyRef"] = row["key"];
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("gallery-management"), data);
    modal.present();
  }

  getDataChildrenSubCategory(needle, haystack, keyCompare) {
    return haystack.filter(function (value) {
      return value[keyCompare] == needle;
    });


  }


  getFormatDataViewComponentCategory(data: any = []) {
    let result = [];
    let buttonsIcon = {
      type: "template",
      data: [
        {
          name: "create",
          event: "editCategory"
        },
        {
          name: "trash",
          event: "removeCategory"
        }
      ]
    };

    data.forEach((value, index) => {

      let pushData = {
        title: value.name,
        image: value.url,
        description: value.description,
        icons: buttonsIcon,
        "key": value["key"]
      };
      result.push(pushData);
    });
    return result;
  }

  initManagementViewValuesComponentCategory(data) {
    this.paramsDataManagementCategories = {
      hasChildren: false,//only description
      allowExpandable: false,
      data: this.getFormatDataViewComponentCategory(data),
      floatRightButtons: true
    }
  }

  getFormatDataViewComponentSubCategory(data: any = []) {
    let result = [];
    let buttonsIcon = {
      type: "template",
      data: [
        {
          name: "create",
          event: "editSubCategory"
        },

        {
          name: "images",
          event: "addAlbum"
        },
        {
          name: "trash",
          event: "removeSubCategory"
        },
      ]
    };

    data.forEach((value, index) => {

      let pushData = {
        title: value.name,
        image: value.url,
        description: value.description,
        icons: buttonsIcon,
        "key": value["key"],
        category_id:value.category_id,
        category:value.category,

      };
      result.push(pushData);
    });
    return result;
  }

  initManagementViewValuesComponentSubCategory(data) {
    this.paramsDataManagementSubCategories = {
      hasChildren: false,//only description
      allowExpandable: false,
      data: this.getFormatDataViewComponentSubCategory(data),
      floatRightButtons: true
    }
  }

  changesValuesChildrenButtons(eventData) {
console.log(eventData);
    if (eventData.eventName == "editCategory") {
      let row = {
        key: eventData.item.key,
        description: eventData.item.description,
        name: eventData.item.title,
        url: eventData.item.image,

      }
      this.editCategory(row);
    }
    if (eventData.eventName == "removeCategory") {
      let row = {
        key: eventData.item.key,
        description: eventData.item.description,
        name: eventData.item.title,
        url: eventData.item.image,
      }
      this.removeCategory(row);
    }

    if (eventData.eventName == "editSubCategory") {
      let row = {
        key: eventData.item.key,
        description: eventData.item.description,
        name: eventData.item.title,
        url: eventData.item.image,
        category_id: eventData.item.category_id,

      }
      this.editSubCategory(row);
    }
    if (eventData.eventName == "removeSubCategory") {
      let row = {
        key: eventData.item.key,
        description: eventData.item.description,
        name: eventData.item.title,
        url: eventData.item.image,
      }
      this.removeSubCategory(row);
    }
    if (eventData.eventName == "addAlbum") {
      let row = {
        key: eventData.item.key,
        description: eventData.item.description,
        name: eventData.item.title,
        url: eventData.item.image,
      }
      this.addAlbum(row);
    }
  }


}
