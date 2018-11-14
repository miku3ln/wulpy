import {Component, ViewChild} from '@angular/core';
import {IonicPage, Nav, NavController, NavParams} from 'ionic-angular';
// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import {ViewController, ModalController} from 'ionic-angular';
import {Http} from '@angular/http';
import {ConfigProvider} from '../../providers/config/config';
import {LoadingProvider} from '../../providers/loading/loading';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';
import {SharedDataProvider} from '../../providers/shared-data/shared-data';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';
import {AlertProvider} from '../../providers/alert/alert';
/*import { GooglePlus } from '@ionic-native/google-plus';*/

import {ConfigDataFirebaseProvider} from '../../providers/config-data-firebase/config-data-firebase';
import {SignUpManagementPage} from "../sign-up-management/sign-up-management";
/**
 * Generated class for the LoginManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login-management',
  templateUrl: 'login-management.html',
})
export class LoginManagementPage {
  formData = {customers_email_address: '', customers_password: ''};
  errorMessage = '';

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private fb: Facebook,
    public alert: AlertProvider,
    /*  private googlePlus: GooglePlus*/
    public configDataFirebase: ConfigDataFirebaseProvider,
    public nav: Nav
  ) {

  }

  public initSaveServer: boolean = false;

  login() {
    this.loading.show();
    this.errorMessage = '';
    this.configDataFirebase.emailLogin(this.formData.customers_email_address, this.formData.customers_password)
      .then(user => {
        this.configDataFirebase.setAuthState(user);
        this.loading.hide();
        if (this.initSaveServer) {
          this.http.post(this.config.url + 'processLogin', this.formData).map(res => res.json()).subscribe(data => {
            this.loading.hide();
            if (data.success == 1) {
              this.shared.login(data.data[0]);

            }
            if (data.success == 0) {
              this.errorMessage = data.message;
            }
          });


        }
      }).catch(error => {
      console.log(error);
      this.errorMessage = error.message;
      this.loading.hide();
    });

  }

  openSignUpPage() {
    this.nav.setRoot("SignUpManagementPage");

  }

  openForgetPasswordPage() {
    let modal = this.modalCtrl.create("ForgotPasswordPage");
    modal.present();
  }

  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {
        console.log("user connected already" + res.authResponse.accessToken);
        this.createAccount(res.authResponse.accessToken, 'fb');

      }
      else {
        console.log("USer Not login ");
        this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => {
            // this.alert.show('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.createAccount(res.authResponse.accessToken, 'fb');
          })
          .catch(e => this.alert.show('Error logging into Facebook' + JSON.stringify(e)));
      }
    }).catch(e => this.alert.show('Error Check Login Status Facebook' + JSON.stringify(e)));
  }

  googleLogin() {
    /*this.loading.autoHide(500);
    this.googlePlus.login({})
      .then(res => {
      //  alert(JSON.stringify(res))
        this.createAccount(res, 'google');
      })
      .catch(err => this.alert.show(JSON.stringify(err)));*/
  }

  //============================================================================================
  //creating new account using function facebook or google details
  createAccount(info, type) {
    // alert(info);
    this.loading.show();
    var data: { [k: string]: any } = {};
    var url = '';
    if (type == 'fb') {
      url = 'facebookRegistration';
      data.access_token = info;
    }
    else {
      url = 'googleRegistration';
      data = info;
    }
    this.http.post(this.config.url + url, data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      // alert("data get");
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //alert('login');
        this.alert.showWithTitle("<h3>Your Account has been created successfully !</h3><ul><li>Your Email: "
          + "<span>" + this.shared.customerData.customers_email_address + "</span>" + "</li><li>Your Password: "
          + "<span>" + this.shared.customerData.customers_password + "</span>" +
          " </li></ul><p>You can login using this Email and Password.<br>You can change your password in Menu -> My Account</p>", "Account Information");
        //  $ionicSideMenuDelegate.toggleLeft();
        this.dismiss();

      }
      else if (data.success == 2) {
        //  alert("login with alreday");
        this.dismiss();
        this.shared.login(data.data[0]);
      }

    }, error => {
      this.loading.hide();
      this.alert.show("error " + JSON.stringify(error));
      // console.log("error " + JSON.stringify(error));
    });
  };

  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
