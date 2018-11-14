import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {b} from "@angular/core/src/render3";
import {FirebaseStorageService} from "../../services/firebase-storage";
import {Observable} from "rxjs/Observable";
import {ToastService} from "../../services/toast-service";
import {ManagementFilesService} from "../../services/management-files";
import {GalleryManagementService} from "../../services/galery-management-service";
/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gallery-management',
  templateUrl: 'gallery-management.html',

})
export class GalleryManagementPage {
  public createRegister: boolean = true;
  formData = {
    name: '',
    description: '',
    url: '',
    subcategory_id: '',
    subcategory: "",
    fullPath: ""
  };
  data = null;
  image;
  errorMessage = '';
  keyRef = null;
  public title: string = "Agregar Foto";
  public btnRegisterTitle: string = "Registrar";
  public readAsArrayBuffer = {};
  public chooseEvent: boolean = false;
  public dataGallery = [];
  public keyGallery;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              public configDataFirebase: ConfigDataFirebaseProvider,
              public config: ConfigProvider,
              public loading: LoadingProvider,
              public modalCtrl: ModalController,
              public serviceStorage: FirebaseStorageService,
              public toast: ToastService,
              public managementFiles: ManagementFilesService,
              public galleryService: GalleryManagementService
  ) {


    this.data = navParams.get('data');
    this.keyRef = this.data.keyRef;
    this.formData.subcategory_id = this.keyRef;
    this.galleryService.load(this.keyRef).subscribe(dataRows => {
      this.dataGallery = dataRows;
      console.log("galer");
    }, error => {
      console.log("error");

    });
  }

  dismiss() {

    this.viewCtrl.dismiss();
  }


  chooseFile() {
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
        this.formData.url = result["img"].url;
        this.formData["fullPath"] = result["img"].fullPath;
        let params = this.getValuesSave();
        params["key"] = this.keyRef;
        this.managementRegisterDb(params);
        this.endManagement("Registro Guardado Correctamente.");
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
          this.formData.url = result["img"].url;
          this.formData["fullPath"] = result["img"].fullPath;
          let params = {
            key: this.keyGallery,
            parentKey: this.keyRef,
            data: this.getValuesSave()
          }
          this.managementRegisterDb(params);
          this.endManagement("Registro Actualizado Correctamente");
        }, error => {
          let result = {msj: error.msj, error: error.error};
          this.endManagement(result.msj);
        });
      } else {
        let params = {
          key: this.keyGallery,
          parentKey: this.keyRef,
          data: this.getValuesSave()
        }
        this.managementRegisterDb(params);
        this.endManagement("Registro Actualizado Correctamente.")
      }
    }

  }

  managementRegisterDb(params) {
    if (this.createRegister) {
      return this.serviceStorage.putGalleryData(params);

    } else {
      return this.serviceStorage.updateGallery(params);
    }
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
        let fullPath = this.serviceStorage.fullPathGallery + "/" + this.readAsArrayBuffer["name"];
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
    this.resetValues();
  }

  getValuesSave() {
    let params = {
      name: this.formData.name,
      description: this.formData.description ? this.formData.description : "",
      url: this.formData.url,
      subcategory: this.formData.subcategory,
      subcategory_id: this.formData.subcategory_id,
      fullPath: this.formData["fullPath"],

    };
    return params;
  }

  setValuesSave(row) {
    this.formData = {
      name: row.name,
      description: row.description,
      url: row.url,
      subcategory_id: row.subcategory_id,
      subcategory: row.subcategory,
      fullPath: row.fullPath,
    };
    this.image = row.url;
  }

  resetValues() {
    this.formData = {
      name: '',
      description: '',
      url: '',
      subcategory_id: this.keyRef,
      subcategory: "",
      fullPath: ""

    };
    this.createRegister = true;
    this.keyGallery = "";
    this.btnRegisterTitle = "Registrar";
    this.image = null;
  }

  editGallery(row) {
    let keyGallery = row["key"];
    this.resetValues();
    this.createRegister = false;
    this.keyGallery = keyGallery;
    this.setValuesSave(row);
    this.btnRegisterTitle = "Actualizar";

  }

  removeGallery(row) {

    let keyGallery = row["key"];
    let keyCubCategory = this.keyRef;

    let fullPath = this.serviceStorage.fullPathGallery + "/" + keyCubCategory + "/" + keyGallery;
    this.serviceStorage.deleteFile({
      fullPath: fullPath
    }).then(result => {
      console.log(result);
    })
  }
}
