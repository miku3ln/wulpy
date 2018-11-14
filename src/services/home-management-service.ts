import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class HomeManagementService {
  public pathOrRef: string = AppSettings.pathOrRef["home"];
  public paramsPage: Array<any>;
  public title: string = "Inicio";

  constructor(public db: AngularFireDatabase, public config: ConfigProvider) {

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

    return new Observable(observer => {
      this.db
        .object(this.pathOrRef)
        .valueChanges()
        .subscribe(snapshot => {
          observer.next(snapshot);
        }, err => {
          observer.error([]);
          observer.complete();
        });
    });

  }

  putDataConfig(params: any = null) {
    let path = this.pathOrRef; // Endpoint on firebase
    let data = params;
    return this.db.list(path).push(data);
  }

  updateDataConfig(params): Promise<any> {
    /*    let key = params.key;*/
    let path = this.pathOrRef;
    let data = params.data;
    return this.db.object(path).update(data);
  }
}
