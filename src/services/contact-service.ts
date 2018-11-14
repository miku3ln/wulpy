import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class ContactService {
  public pathOrRef: string = AppSettings.pathOrRef["contact-us"];
  public paramsPage: Array<any>;

  constructor(public af: AngularFireDatabase, public config: ConfigProvider) {

  }

  getDataParams = () => {
    return {
      params: {
        "title": "Contactanos",
        "subtitle": "OF DEVELOPING",
        "address": "Piedrahita y Buenos Aires",
        "phoneNo": "0985617541",
        "email":"kalexmiguelalba@gmail.com",
        position: {lat: 0.2220764, lng: -78.262739}
      }
    };
  };

  load(): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(this.config.statusNetwork);
    } else {
      return this.getDataByStatusNetwork(false);
    }
  }

  getDataByStatusNetwork(status) {
    if (status) {
      return new Observable(observer => {
        this.af
          .object(this.pathOrRef)
          .valueChanges()
          .subscribe(snapshot => {
            observer.next(snapshot);
          }, err => {
            observer.error([]);
            observer.complete();
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
