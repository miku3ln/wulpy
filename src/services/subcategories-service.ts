import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class SubcategoriesService {
  public pathOrRef: string = AppSettings.pathOrRef["subcategories"];

  constructor(public db: AngularFireDatabase, public config: ConfigProvider) {

  }

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
        this.db
          .object(this.pathOrRef)
          .valueChanges()
          .subscribe(snapshot => {
            let result = [];
            if (snapshot) {
              result = Object.keys(snapshot).map(function (index) {
                let row = snapshot[index];
                row["key"] = index;
                return row;
              });
            }

            observer.next(result);
          }, err => {
            observer.error([]);
            observer.complete();
          });
      });
    } else {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
  }

}
