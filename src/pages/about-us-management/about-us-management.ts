import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {LoadingProvider} from "../../providers/loading/loading";
import {ToastService} from "../../services/toast-service";
import {AboutUsManagementService} from "../../services/about-us-management-service";
import {DataManagerPagesProvider} from "../../providers/data-manager-pages/data-manager-pages";
import {AppSettings} from "../../services/app-settings";
import {FirebaseStorageService} from "../../services/firebase-storage";

@IonicPage()
@Component({
  selector: 'page-about-us-management',
  templateUrl: 'about-us-management.html',
  providers: [AboutUsManagementService,FirebaseStorageService]
})
export class AboutUsManagementPage {
  public paramsPage: Object = {};
  public createRegister: boolean = true;
  public title: string = "Quienes Somos";
  public dataItemns = [];
  public allowAddItems = false;
  public formData = {
    'about-us': '',
    'img': "",
    description: '',
    title: '',

  };
  errorMessage = '';
  public btnRegisterTitle: string = "Registrar";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: AboutUsManagementService,
    public loading: LoadingProvider,
    public toast: ToastService,
    public platform: Platform,
    public modalCtrl: ModalController,
    public dataManagerPages: DataManagerPagesProvider,
    public serviceStorage: FirebaseStorageService,

  ) {
    this.initGetData();
  }


  initGetData() {
    this.loading.show();
    this.platform.ready().then(() => {
      this.service.load().subscribe(paramsPage => {
        this.paramsPage = paramsPage;
        this.setDataPage(paramsPage);
        this.loading.hide();

      }, error => {
        console.log("error");
        this.loading.hide();

      });
    });

  }

  setDataPage(data) {
    if (data) {
      this.btnRegisterTitle = "Actualizar";
      this.createRegister = false;
      this.formData = {
        title: data.params.title,
        description: data.params.description ? data.params.description : "",
        img: data.params.img ? data.params.img : "",
        'about-us': data.params["about-us"] ? data.params["about-us"] : "",
      }
      this.allowAddItems = true;

      if (data.items) {
        let itemsSnaphot = data.items
        let result = Object.keys(itemsSnaphot).map(function (index) {
          let row = [];
          row = itemsSnaphot[index];
          row["key"] = index;
          return row;
        });
        this.dataItemns = result;
      }else{
        this.dataItemns = [];
      }
    } else {
      this.btnRegisterTitle = "Registrar";
      this.createRegister = true;
      this.allowAddItems = false;

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
      this.endManagement("Guardado Correctament");
    } else {//update

      let paramsSave = {
        data: {params: this.formData}
      }
      let result = this.managementRegisterDb(paramsSave);
      console.log("res", result);
      this.endManagement("Guardado Correctament");
    }

  }

  endManagement(msj) {
    this.toast.presentToast(msj, {position: "down", duration: 4000});
    this.loading.hide();

  }

  initManagement() {

    this.loading.show(true);

  }

  managementRegisterDb(params) {
    if (this.createRegister) {
      return this.service.putDataConfig(params);

    } else {
      return this.service.updateDataConfig(params);
    }
  }

  addItem() {
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("about-us-item-management"));
    modal.present();
  }

  editItem(row) {
    let data = {data: row};
    data["data"]["keyRef"] = row["key"];
    let modal = this.modalCtrl.create(this.dataManagerPages.getPageObjByType("about-us-item-management"), data);
    modal.present();
  }

  removeItem(row) {
    let key = row["key"];
    this.loading.show();
    let fullPathDatabase = AppSettings.pathOrRef["about-us"]+"/items/"+key;
    /*DELETE CHILDREN DATABASE*/
    this.serviceStorage.deleteFile({fullPath: fullPathDatabase}).then(result => {
      console.log("success deleteFile category");
      this.loading.hide();
    }, error => {
      console.log("error deleteFile category");
      this.loading.hide();
    });

  }
}
