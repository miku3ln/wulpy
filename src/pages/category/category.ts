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
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  public createRegister: boolean = true;
  formData = {
    name: '',
    description: '',
    url: '',
    fullPath: ""

  };
  data = null;
  image;
  errorMessage = '';
  keyRef = null;
  public title: string = "Crear Categoria";
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
      this.formData = {
        name: this.data.name,
        description: this.data.description,
        url: this.data.url,
        fullPath: this.data.fullPath

      };
      this.keyRef = this.data.keyRef;
      this.title = "Editar Categoria";
      this.image = this.data.url;
      this.btnRegisterTitle = "Actualizar";

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  dismiss() {

    this.viewCtrl.dismiss();
  }

  chooseFile() {
    console.log("chooseFile ca");
    this.managementFiles.chooseFile(this.createRegister).subscribe(data => {
      this.readAsArrayBuffer = {dirPath: data.result.dirPath, name: data.result.name};
      if (!this.createRegister) {
        this.chooseEvent = true;
      }
      this.formData.url = "ok";
      this.image = data.result.base64File;
    }, error => {
      let result = {msj: error.msj, error: error.error};
      this.toast.presentToast(result.msj, {position: "down"});
      this.image = null;
    });

  }


  saveRegister() {
    let user;
    this.loading.show(true);
    this.errorMessage = '';
    if (this.createRegister) {
      let params = {
        img: {
          dirPath: this.readAsArrayBuffer["dirPath"],
          name: this.readAsArrayBuffer["name"]
        }
      };
      this.managementUpload(params).subscribe(result => {
        let params = {
          name: this.formData.name,
          description: this.formData.description ? this.formData.description : "",
          url: result["img"].url,
          fullPath: result["img"].fullPath
        };
        this.formData.url = result["img"].url;
        this.managementRegisterDb(params).subscribe(result => {
          this.endManagement("Registro Guardado Correctamente.");
        }, error => {
          this.endManagement("Registro No Guardado.");
        });
      }, error => {
        let result = {msj: error.msj, error: error.error};
        this.endManagement(result.msj);
      });
    } else {//update

      if (this.chooseEvent) {
        let params = {
          img: {
            dirPath: this.readAsArrayBuffer["dirPath"],
            name: this.readAsArrayBuffer["name"]
          }
        };
        this.managementUpload(params).subscribe(result => {
          let params = {
            key: this.keyRef,
            data: {
              name: this.formData.name,
              description: this.formData.description ? this.formData.description : "",
              url: result["img"].url
            }
          }
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
          data: {
            name: this.formData.name,
            description: this.formData.description ? this.formData.description : "",
            url: this.formData.url
          }
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
        let result = this.serviceStorage.putCategorieData(params);
        observer.next(result);
        observer.complete();
      } else {
        this.serviceStorage.updateCategorieData(params).then(result => {
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
        let fullPath = this.serviceStorage.fullPathCategories + "/" + this.readAsArrayBuffer["name"];
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
