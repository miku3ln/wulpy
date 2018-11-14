import {EventEmitter, Injectable, NgZone, Output} from '@angular/core';

import {AlertProvider} from '../../providers/alert/alert';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import {count} from "rxjs/operator/count";
import {Events, ModalController, NavController, NavParams, Platform} from "ionic-angular";
import {BehaviorSubject} from "rxjs";
/*FIREBASE*/
import {AngularFireDatabase} from 'angularfire2/database';

import {AngularFireAuth} from 'angularfire2/auth';

import firebase from 'firebase';
import {ConfigProvider} from "../config/config";
import {LoadingProvider} from "../loading/loading";
import {Http} from "@angular/http";
import {DataManagerPagesProvider} from "../data-manager-pages/data-manager-pages";

@Injectable()
export class ConfigDataFirebaseProvider {
  authState: any = null;
  @Output() messageEvent = new EventEmitter<any>();

  zone: any;

  static get parameters() {
    return [
      [Events],
      [NgZone],
      [Storage],
      [AlertProvider],
      [AngularFireAuth],
      [AngularFireDatabase],

    ];
  }

  constructor(
    public events: Events,
    public ngZone: NgZone,
    private storage: Storage,
    public alert: AlertProvider,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {

  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser2(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable() {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest'
    }
    else if (this.currentUserAnonymous) {
      return 'Anonymous'
    }
    else {
      return this.authState['displayName'] || 'User without a Name'
    }
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(email: string, password: string, displayName: string = null, phoneNumber: string = null,) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  setAuthState(user) {
    this.authState = user
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////
  signOut() {
    return this.afAuth.auth.signOut();

  }


  //// Helpers ////
  updateUserData(user=null,params: any = null): Promise<any> {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let uid = user.uid;
    let email = user.email;
    this.updateInformationUser(params);
    if (params.new) {//register
      params["wulpymsPoints"] = {
        points: 0
      }
    }
    let path = `users/${uid}`; // Endpoint on firebase
    let data = params;
    return this.db.object(path).update(data);


  }

  updateInformationUser(params) {
    let displayName = params.displayName;
    let photoURL = params.photoURL ? params.photoURL : null;
    let phoneNumber = params.phoneNumber ? params.phoneNumber : null
    let user = this.getCurrentUser();
    user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    }).then(function () {
      console.log("update ready dsplay name");
      // Update successful.
    }).catch(function (error) {
      console.log("error ready dsplay name");

      // An error happened.
    });
  }

  getCurrentUser() {
    /*var user = firebase.auth().currentUser;*/
    return this.afAuth.auth.currentUser;
  }

  public custormer_data;

  getStateCurrentUser() {
    return this.afAuth.authState;
  }

  getDataInformationUser(user, userInfo) {
    let customer_data = {
      customers_id: null,
      email: null,
      customers_picture: null,
      customers_firstname: null,
      customers_lastname: null,
      phoneNumber: null,
      customers_telephone: null,
      customers_email_address: null
    };
    if (user) {
      customer_data = {
        customers_id: user.uid ? user.uid : null,
        email: user.email ? user.email : null,
        customers_picture: (userInfo && userInfo.photoURL) ? userInfo.photoURL : "assets/avatar.png",
        customers_firstname: (userInfo &&userInfo.displayName) ? userInfo.displayName : null,
        customers_lastname: "",
        phoneNumber:(userInfo && userInfo.phoneNumber ? userInfo.phoneNumber : null),
        customers_telephone:(userInfo && userInfo.phoneNumber ? userInfo.phoneNumber : null),
        customers_email_address: user.email ? user.email : null
      };


    }
    return customer_data;
  }

}
