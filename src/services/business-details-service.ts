import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class BusinessDetailsService {
  public pathOrRef: string = AppSettings.pathOrRef["business"];
  public paramsPage: Array<any>;

  constructor(public af: AngularFireDatabase, public config: ConfigProvider) {

  }

  getDataParams = () => {
    return {
      params: []
    };
  };

  load(keyBusiness): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(this.config.statusNetwork,keyBusiness);
    } else {
      return this.getDataByStatusNetwork(false,keyBusiness);
    }
  }

  getDataByStatusNetwork(status,keyBusiness) {
    if (status) {
      return new Observable(observer => {
        this.af
          .object(this.pathOrRef+"/"+keyBusiness)
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
