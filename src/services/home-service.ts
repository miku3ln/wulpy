import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class HomeService {
  public pathOrRef: string = AppSettings.pathOrRef["home"];
  public pathOrRefPymes: string = "checkBoxes";

  public paramsPage: Array<any>;

  constructor(public af: AngularFireDatabase, public config: ConfigProvider) {

  }
  getDataParams = () => {
    return {
      params: {
        "title": "Wulpyms",
        "subtitle": "OF DEVELOPING",
        "description": "For better understanding how our template works please read documentation.",
        "background": "assets/images/background/29.jpg"
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
