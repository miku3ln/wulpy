import {Component} from '@angular/core';
import {IonicPage, ModalController, Nav, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {Http} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {LoadingProvider} from "../../providers/loading/loading";
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";
import {LoginManagementPage} from "../login-management/login-management";

/**
 * Generated class for the SignUpManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up-management',
  templateUrl: 'sign-up-management.html',
})
export class SignUpManagementPage {
  public initSaveServer = false;
  formData = {
    customers_firstname: '',
    customers_lastname: '',
    customers_email_address: '',
    customers_password: '',
    customers_telephone: '',
    customers_picture: ''
  };
  image;
  errorMessage = '';

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    private camera: Camera,
    public configDataFirebase: ConfigDataFirebaseProvider,
    public nav: Nav
  ) {
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.platform.ready().then(() => {

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.image = 'data:image/jpeg;base64,' + imageData;
        // console.log(base64Image);

      }, (err) => {
      });
    });
  }

  signUp() {
    let user;
    this.loading.show();
    this.errorMessage = '';
    this.formData.customers_picture = this.image;
    this.loading.show();
    this.errorMessage = '';
    /*email: string, password: string,displayName:string=null,phoneNumber:string=null,*/
    let displayName = this.formData.customers_firstname;
    let phoneNumber = this.formData.customers_telephone;
    let paramsUpdate = {displayName: displayName, phoneNumber: phoneNumber, new: true};
    this.configDataFirebase.emailSignUp(this.formData.customers_email_address, this.formData.customers_password, displayName, phoneNumber)
      .then(result => {
        user = result.user;
        this.configDataFirebase.setAuthState(user);
        this.configDataFirebase.updateUserData(user, paramsUpdate).then(result => {
          this.loading.hide();
          if (this.initSaveServer) {
            this.http.post(this.config.url + 'processRegistration', this.formData).map(res => res.json()).subscribe(data => {
              this.loading.hide();
              if (data.success == 1) {
                this.shared.login(data.data[0]);
                this.dismiss();
              }
              if (data.success == 0) {
                this.errorMessage = data.message;
              }
            });


          }
        }).catch(error => {

        });


      }).catch(error => {
      console.log(error);
      this.errorMessage = error.message;
      this.loading.hide();
    });
    /* this.http.post(this.config.url + 'processRegistration', this.formData).map(res => res.json()).subscribe(data => {
       this.loading.hide();
       if (data.success == 1) {
         this.shared.login(data.data[0]);
         //this.config.customerData = data.data[0];
         this.viewCtrl.dismiss();
       }
       if (data.success == 0) {
         this.errorMessage = data.message;
       }
     });*/
  }

  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create('PrivacyPolicyPage');
    modal.present();
  }

  openTermServicesPage() {
    let modal = this.modalCtrl.create('TermServicesPage');
    modal.present();
  }

  openRefundPolicyPage() {
    let modal = this.modalCtrl.create('RefundPolicyPage');
    modal.present();
  }

  dismiss() {

    let modal = this.modalCtrl.create(LoginManagementPage);

  }

  returnPage() {
    this.nav.setRoot(LoginManagementPage);
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }

}
