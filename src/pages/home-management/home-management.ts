import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import {HomeManagementService} from "../../services/home-management-service";
import {LoadingProvider} from "../../providers/loading/loading";
import {ToastService} from "../../services/toast-service";

/**
 * Generated class for the HomeManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home-management',
  templateUrl: 'home-management.html',
  providers: [HomeManagementService]
})
export class HomeManagementPage {
  public paramsPage: Object = {};
  public createRegister: boolean = true;
  public title: string = "Inicio";
  public formData = {
    title: '',
    description: '',
  };
  errorMessage = '';
  public btnRegisterTitle: string = "Registrar";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: HomeManagementService,
    public loading: LoadingProvider,
    public toast: ToastService,
    public platform: Platform,
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
      }
    } else {
      this.btnRegisterTitle = "Registrar";
      this.createRegister = true;
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

    this.loading.show();

  }

  managementRegisterDb(params) {
    if (this.createRegister) {
      return this.service.putDataConfig(params);

    } else {
      return this.service.updateDataConfig(params);
    }
  }
}
