// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import {Component} from '@angular/core';
/*import { TranslateService } from '@ngx-translate/core';*/
import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {ConfigProvider} from '../../providers/config/config';
import {Http} from '@angular/http';
import {Platform, NavController, IonicPage} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {AlertProvider} from '../../providers/alert/alert';
import {LoadingProvider} from '../../providers/loading/loading';
import {ConfigDataFirebaseProvider} from "../../providers/config-data-firebase/config-data-firebase";

/*import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';*/

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  public allowEditPassword: boolean = false;
  public enableSaveServer = false;
  public initSaveServer: boolean = false;
  myAccountData = {
    customers_firstname: '',
    customers_lastname: '',
    customers_telephone: '',
    currentPassword: '',
    customers_password: '',
    customers_dob: '',
    customers_old_picture: ''
  };
  profilePicture = '';
  passwordData: { [k: string]: any } = {};

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    /* public translate: TranslateService,*/
    public platform: Platform,
    private camera: Camera,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public configDataFirebase: ConfigDataFirebaseProvider,
  ) {
  }

  //============================================================================================  
  //function updating user information
  updateInfo = function () {
    //this.shared.customerData.customers_password="1234"
    let currenrtPassword = this.myAccountData.currentPassword;
    let newPassword = this.myAccountData.customers_password;
    // console.log(currenrtPassword + "  " + newPassword);
    // console.log(this.shared.customerData.customers_password);
    if (this.allowEditPassword) {
      if (newPassword != "" && currenrtPassword == "") {
        this.alert.show("Please Enter Current Password");

        /*this.translate.get("Please Enter Current Password").subscribe((res) => {
        });*/

      }
      else if (currenrtPassword != "" && currenrtPassword != this.shared.customerData.customers_password) {

        this.alert.show("Please Enter Current Password Correctly");
        /*this.translate.get("Please Enter Current Password Correctly").subscribe((res) => {
        });*/

      }
      else if (newPassword != undefined && newPassword != "" && currenrtPassword != this.shared.customerData.customers_password) {

        this.alert.show("Please Enter Current Password Correctly");
        /*   this.translate.get("Please Enter Current Password Correctly").subscribe((res) => {
           });*/

      }
    }
    else {
      this.loading.show();
      this.myAccountData.customers_id = this.shared.customerData.customers_id;

      if (this.profilePicture == this.shared.customerData.customers_picture) { //console.log("old picture");
        // this.myAccountData.customers_picture=$rootScope.customerData.customers_picture;
        this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
      }
      else if (this.profilePicture == '')
        this.myAccountData.customers_picture = null;
      else
        this.myAccountData.customers_picture = this.profilePicture;

      var data = this.myAccountData;
      //  console.log("post data  "+JSON.stringify(data));
      /* updateUserData*/
      let displayName = data.customers_firstname;
      let phoneNumber = data.customers_telephone;
      let paramsUpdate = {displayName: displayName, phoneNumber: phoneNumber};
      let formData = this.formData;
      this.configDataFirebase.getStateCurrentUser().subscribe(user => {
          this.configDataFirebase.updateUserData(user, paramsUpdate).then(result => {
            this.loading.hide();
            this.updateManagementUserServer(user, data);
          }).catch(error => {
            this.loading.hide();

          });
        }
      );


    }
  }

  openCamera() {
    this.loading.autoHide(1000);
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
        this.profilePicture = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
      });
    });
  }

  ionViewWillEnter() {
    this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;
    this.profilePicture = this.shared.customerData.customers_picture ? this.shared.customerData.customers_picture : "assets/avatar.png";
    this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    this.myAccountData.customers_telephone = this.shared.customerData.customers_telephone;
    try {
      // console.log(this.shared.customerData.customers_dob);
      this.myAccountData.customers_dob = new Date(this.shared.customerData.customers_dob).toISOString();
      // console.log(this.myAccountData.customers_dob);
    } catch (error) {
      this.myAccountData.customers_dob = new Date("1-1-2000").toISOString();
    }

  }

  openCart() {
    /*  this.navCtrl.push(CartPage);*/
  }

  openSearch() {
    /*this.navCtrl.push(SearchPage);*/
  }

  updateManagementUserServer(user,data) {
    if (this.enableSaveServer) {


      this.http.post(this.config.url + 'updateCustomerInfo', data).map(res => res.json()).subscribe(data => {

          this.loading.hide();
          if (data.success == 1) {
            //   document.getElementById("updateForm").reset();
            this.alert.show(data.message);
            this.shared.customerData.customers_firstname = this.myAccountData.customers_firstname;
            this.shared.customerData.customers_lastname = this.myAccountData.customers_lastname;
            this.shared.customerData.customers_telephone = this.myAccountData.customers_telephone;
            this.shared.customerData.customers_picture = data.data[0].customers_picture;

            this.shared.customerData.customers_dob = this.myAccountData.customers_dob;
            if (this.myAccountData.customers_password != '')
              this.shared.customerData.customers_password = this.myAccountData.customers_password;

            this.shared.login(this.shared.customerData);

            this.myAccountData.currentPassword = "";
            this.myAccountData.customers_password = "";
          }
        }
        , error => {
          this.loading.hide();
          this.alert.show("Error while Updating!");
        });
    }
  }
}
