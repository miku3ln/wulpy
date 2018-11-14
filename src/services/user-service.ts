import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class UsersService {
  public pathOrRef: string = AppSettings.pathOrRef["users"];
  public paramsPage: Array<any>;

  constructor(public af: AngularFireDatabase, public config: ConfigProvider) {

  }

  getDataParams = () => {
    return {
      params: {
        "title": "Quienes Somos",
        "img": "http://pfpenergy.co.uk/media/1188/about-us-title-2.png",
        "about-us": "Somos Una empresa dedicada a la informacion de ventas.",
        "services": [
          {content: "Una empresa dedicada a la", subtitle: "Subtitle", title: "Titulo ", type: "privacyPolicy"},
          {content: "Una empresa dedicada a la", subtitle: "Subtitle", title: "Titulo ", type: "privacyPolicy"}
        ],
      }
    };
  };

  load(keyUser, stateNetwork: boolean): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(stateNetwork, keyUser);
    } else {
      return this.getDataByStatusNetwork(false, keyUser);
    }
  }

  getDataByStatusNetwork(status, keyUser) {
    if (status) {
      return new Observable(observer => {
        this.af
          .object(this.pathOrRef + "/" + keyUser)
          .valueChanges()
          .subscribe(snapshot => {
            observer.next(snapshot);
          }, err => {
            observer.error([]);
            observer.complete();
          },()=>{
            console.log("complete getDataByStatusNetwork");
          });
      });
    } else {
      return new Observable(observer => {
        observer.next(this.getDataParams());
        observer.complete();
      });
    }
  }

}
