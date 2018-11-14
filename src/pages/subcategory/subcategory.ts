import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {FirebaseStorageService} from "../../services/firebase-storage";
import {Observable} from "rxjs/Observable";
import {ToastService} from "../../services/toast-service";
import {ManagementFilesService} from "../../services/management-files";
import {CategoriesService} from "../../services/categories-service";


/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subcategory',
  templateUrl: 'subcategory.html',
})
export class SubcategoryPage {
  public createRegister: boolean = true;
  formData = {
    name: '',
    description: '',
    url: '',
    category_id: '',
    category: "",

  };
  data = null;
  image;
  errorMessage = '';
  keyRef = null;
  public title: string = "Crear Subcategoria";
  public btnRegisterTitle: string = "Registrar";
  public readAsArrayBuffer = {};
  public chooseEvent: boolean = false;
  public dataCategories = [];
  public datasubCategoriesRegisters = [];

  /*---data categoria---*/

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              public configDataFirebase: ConfigDataFirebaseProvider,
              public config: ConfigProvider,
              public loading: LoadingProvider,
              public modalCtrl: ModalController,
              public serviceStorage: FirebaseStorageService,
              public toast: ToastService,
              public managementFiles: ManagementFilesService,
              public categoriesService: CategoriesService
  ) {

    this.categoriesService.load().subscribe(dataRows => {

      this.dataCategories = dataRows;


    }, error => {
      console.log("error");

    });
    this.data = navParams.get('data');
    this.datasubCategoriesRegisters = navParams.get('datasubCategories');

    if (this.data) {
      this.createRegister = false;
      this.formData = {
        name: this.data.name,
        description: this.data.description,
        url: this.data.url,
        category_id: this.data.category_id,
        category:  this.data.category,

      };
      this.keyRef = this.data.keyRef;
      this.title = "Editar Subcategoria";
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

  onSelectChange(selectedValue: any) {
    this.formData.category = selectedValue.name;
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
        this.formData.url=result["img"].url;
        let params = this.getValuesSave();
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
          let params = {
            key: this.keyRef,
            data: {
              name: this.formData.name,
              description: this.formData.description ? this.formData.description : "",
              url: result["img"].url,
              fullPath:result["img"].fullPath,
              category: this.formData.category,
              category_id: this.formData.category_id,
            }
          }
          this.managementRegisterDb(params);
          this.endManagement("Registro Actualizado Correctamente");

        }, error => {
          let result = {msj: error.msj, error: error.error};
          this.endManagement(result.msj);


        });
      } else {
        let params = {
          key: this.keyRef,
          data:this.getValuesSave()
        }
        this.managementRegisterDb(params);
        this.endManagement("Registro Actualizado Correctamente.")
      }
    }

  }

  managementRegisterDb(params) {
    if (this.createRegister) {
      return this.serviceStorage.putSubCategorieData(params);

    } else {
      return this.serviceStorage.updateSubCategorieData(params);
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
        let fullPath = this.serviceStorage.fullPathSubCategories + "/" + this.readAsArrayBuffer["name"];
        this.serviceStorage.uploadImage(buffer, fullPath).then((file) => {
          let fullPath = file.metadata.fullPath;
          this.serviceStorage.getPhotoUrl(fullPath).then(uri => {
            let result = {
              msj: "OK",
              img: {
                url: uri,
                fullPath:fullPath
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

  getValuesSave() {
    let params = {
      name: this.formData.name,
      description: this.formData.description ? this.formData.description : "",
      url: this.formData.url,
      category: this.formData.category,
      category_id: this.formData.category_id,
    };
    return params;
  }
}
