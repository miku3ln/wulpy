import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {CategoriesService} from "../../services/categories-service";
import {SubcategoriesService} from "../../services/subcategories-service";
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {AlertProvider} from "../../providers/alert/alert";
import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";
import {GalleryManagementService} from "../../services/galery-management-service";

/**
 * Generated class for the MagazineManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-magazine-management',
  templateUrl: 'magazine-management.html',
  providers: [CategoriesService, SubcategoriesService, GalleryManagementService]
})
export class MagazineManagementPage {
  public title: string = "Categorias";
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
      [CategoriesService],
      [SubcategoriesService],
      [GalleryManagementService],

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
              public categoriesService: CategoriesService,
              public subcategoriesService: SubcategoriesService,
              public galleryService: GalleryManagementService
  ) {
    this.initGetData();
  }

  initGetData() {
    this.loading.show();
    this.platform.ready().then(() => {

      this.categoriesService.load().subscribe(dataRowsCategories => {
        this.subcategoriesService.load().subscribe(dataRowsSubcategories => {

          this.galleryService.loadAll().subscribe(dataRowsSubcategoriesGallery => {
              this.dataCategories = this.getSubCategoriesDistribution(dataRowsCategories, dataRowsSubcategories, dataRowsSubcategoriesGallery);

            },
            error => {
              console.log("error");
              this.loading.hide();
            }
          );

          this.loading.hide();

        }, error => {
          console.log("error");
          this.loading.hide();

        });

      }, error => {
        console.log("error");
        this.loading.hide();

      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCatalogPage');
  }

  getSubCategoriesDistribution(categories, subcategories, gallerySubcategories) {
    let that = this;
    let dataCategoriesDistribution = [];
    categories.forEach(function (category) {
    let countGallery = 0;
      let needle = category.key;
      let haystack = subcategories;
      let subcategoriesOfCategory = that.getValuesOfCategory(needle, haystack);
      let subcategoriesCurrent = [];
      let allowSubCategories = false;

      subcategoriesOfCategory.forEach(function (subcategory) {
        let haystack = gallerySubcategories;
        let needle = subcategory.key;
        let gallerySubcategoryCurrent = that.getValuesOfSubCategory(needle, haystack);
        if (gallerySubcategoryCurrent.length) {
          let currentCountGallery = Object.keys(gallerySubcategoryCurrent[0].data).length;
          let galleryData = Object.keys(gallerySubcategoryCurrent[0].data).map(function (index) {
            let rowsGallery = gallerySubcategoryCurrent[0].data[index];
            let row = [];
            row = rowsGallery;
            row["key"] = index;
            return row;
          });
          let dataPush = {
            galleryData: galleryData,
            info: subcategory,
            countGallery: currentCountGallery
          }
          allowSubCategories = true;
          subcategoriesCurrent.push(dataPush);
          countGallery += currentCountGallery;
        }
      });

      if (allowSubCategories) {
        let dataPush = {
          info: category,
          dataSubcategories: subcategoriesCurrent,
          countGallery: countGallery
        };
        dataCategoriesDistribution.push(dataPush);
      }

    });
    return dataCategoriesDistribution;
  }

  getValuesOfCategory(category_id, haystack) {
    return haystack.filter(function (value) {
      return value.category_id == category_id;
    });

  }

  getValuesOfSubCategory(subcategory_id, haystack) {
    return haystack.filter(function (value) {
      return value.key == subcategory_id;
    });
  }

  openSubCategories(categoryData) {
    this.navCtrl.push(this.dataManagerPages.getPageObjByType("magazine-subcategory-details"), {data: categoryData});
  }

}
