import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ModalController, IonicPage} from 'ionic-angular';
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {FirebaseStorageService} from "../../services/firebase-storage";
import {Observable} from "rxjs/Observable";
import {ToastService} from "../../services/toast-service";
import {ManagementFilesService} from "../../services/management-files";



/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-us-item-management',
  templateUrl: 'about-us-item-management.html',
})
export class AboutUsItemManagementPage {
  public createRegister: boolean = true;
  formData = {};
  data = null;
  image;
  errorMessage = '';
  keyRef = null;
  public title: string = "Crear Información";
  public btnRegisterTitle: string = "Registrar";
  public readAsArrayBuffer = {};
  public chooseEvent: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              public configDataFirebase: ConfigDataFirebaseProvider,
              public config: ConfigProvider,
              public loading: LoadingProvider,
              public modalCtrl: ModalController,
              public serviceStorage: FirebaseStorageService,
              public toast: ToastService,
              public managementFiles: ManagementFilesService
  ) {

    this.data = navParams.get('data');
    if (this.data) {
      this.createRegister = false;
      this.setDataParams(this.data);
      this.keyRef = this.data.keyRef;
      this.title = "Editar Información";
      this.image = this.data.url;
      this.btnRegisterTitle = "Actualizar";
    }
  }

  setDataParams(data) {
    if (data.url) {
      this.formData = {
        name: data.name,
        description: data.description,
        url: data.url,
        fullPath: data.fullPath
      }
    } else {
      this.formData = {
        name: data.name,
        description: data.description,
      }

    }
  }

  getDataParams() {
    let result;
    if (this.formData["img"]) {
      result = {
        name: this.formData["name"],
        description: this.formData["description"] ? this.formData["description"] : "",
        fullPath: this.formData["fullPath"],
        url: this.formData["img"],

      }
    } else {
      result = {
        name: this.formData["name"],
        description: this.formData["description"] ? this.formData["description"] : "",

      }

    }
    return result;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ABOUT US ITMEM MANAGEMENT');
  }

  dismiss() {

    this.viewCtrl.dismiss();
  }

  chooseFile() {
    this.managementFiles.chooseFile(this.createRegister).subscribe(data => {
      this.readAsArrayBuffer = {dirPath: data.result.dirPath, name: data.result.name};
      this.chooseEvent = true;
      this.image = data.result.base64File;
    }, error => {
      let result = {msj: error.msj, error: error.error};
      this.toast.presentToast(result.msj, {position: "down"});
    });
  }


  saveRegister() {
    console.log("saveRegister about us ti");
    this.loading.show(true);
    this.errorMessage = '';
    if (this.createRegister) {
      if (this.chooseEvent) {
        let params = {
          img: {
            dirPath: this.readAsArrayBuffer["dirPath"],
            name: this.readAsArrayBuffer["name"]
          }
        };
        this.managementUpload(params).subscribe(result => {
          this.formData["img"] = result["img"].url;
          this.formData["fullPath"] = result["img"].fullPath;
          let params = this.getDataParams();
          this.managementRegisterDb(params).subscribe(result => {
            this.endManagement("Registro Guardado Correctamente.");
          }, error => {
            this.endManagement("Registro No Guardado.");
          });
        }, error => {
          let result = {msj: error.msj, error: error.error};
          this.endManagement(result.msj);
        });
      } else {
        let params = this.getDataParams();
        this.managementRegisterDb(params).subscribe(result => {
          this.endManagement("Registro Guardado .");
        }, error => {
          this.endManagement("Registro No Guardado.");
        });
      }
    } else {//update

      if (this.chooseEvent) {
        let params = {
          img: {
            dirPath: this.readAsArrayBuffer["dirPath"],
            name: this.readAsArrayBuffer["name"]
          }
        };
        this.managementUpload(params).subscribe(result => {
          this.formData["img"] = result["img"].url;
          this.formData["fullPath"] = result["img"].fullPath;
          let params = {
            key: this.keyRef,
            data: this.getDataParams()
          };
          this.managementRegisterDb(params).subscribe(result => {
            this.endManagement("Registro Actualizado.");
          }, error => {
            this.endManagement("Registro No Actualizado.");
          });

        }, error => {
          let result = {msj: error.msj, error: error.error};
          this.endManagement(result.msj);
        });
      } else {
        let params = {
          key: this.keyRef,
          data: this.getDataParams()
        }
        this.managementRegisterDb(params).subscribe(result => {
          this.endManagement("Registro Actualizado.");
        }, error => {
          this.endManagement("Registro No Actualizado.");
        });

      }
    }

  }

  managementRegisterDb(params): Observable<any> {
    return new Observable(observer => {

      if (this.createRegister) {
        let result = this.serviceStorage.putAboutUsItemData(params);
        observer.next(result);
        observer.complete();
      } else {
        this.serviceStorage.updateAboutUsItemData(params).then(result => {
          observer.next(result);
          observer.complete();
        }, error => {
          observer.error(error);
          observer.complete();

        });


      }
    });


  }

  managementUpload(params): Observable<any> {
    let dirPath = params.img.dirPath;
    let name = params.img.name;
    let paramsCurrent = {
      dirPath: dirPath,
      name: name
    };
    return new Observable(observer => {
      this.managementFiles.managementGenerateBuffer(params).subscribe(buffer => {
        let fullPath = this.serviceStorage.fullPathContactUsItemManagement + "/" + this.readAsArrayBuffer["name"];
        this.serviceStorage.uploadImage(buffer, fullPath).then((file) => {
          let fullPath = file.metadata.fullPath;

          this.serviceStorage.getPhotoUrl(fullPath).then(uri => {
            let result = {
              msj: "OK",
              img: {
                url: uri,
                fullPath: fullPath
              }
            };
            observer.next(result);
            observer.complete();

          }, error => {
            let msj = "Error getPhotoUrl ";
            observer.error({msj: msj, error: error});
            observer.complete();
          });
        }, error => {
          let msj = "Error uploadImage ";
          observer.error({msj: msj, error: error});
          observer.complete();
        }).catch(error => {
          let msj = "Catch uploadImage ";
          observer.error({msj: msj, error: error});
          observer.complete();
        });
      }, result => {
        observer.error({msj: result.msj, error: result.error});
        observer.complete();
      })
      ;


    });
  }

  endManagement(msj) {
    this.toast.presentToast(msj, {position: "down", duration: 4000});
    this.loading.hide();
    this.dismiss();
  }
}
