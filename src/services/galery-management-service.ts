import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";

@Injectable()
export class GalleryManagementService {
  public pathOrRef: string = AppSettings.pathOrRef["gallery"];

  constructor(public db: AngularFireDatabase, public config: ConfigProvider) {

  }

  load(keyRef): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(this.config.statusNetwork, keyRef);
    } else {
      return this.getDataByStatusNetwork(false, keyRef);
    }
  }

  loadAll(): Observable<any> {
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return this.getDataByStatusNetwork(this.config.statusNetwork);
    } else {
      return this.getDataByStatusNetwork(false);
    }
  }

  getDataByStatusNetwork(status, keyRef = null) {
    if (status) {
      let path = keyRef ? this.pathOrRef + "/" + keyRef : this.pathOrRef;
      return new Observable(observer => {
        this.db
          .object(path)
          .valueChanges()
          .subscribe(snapshot => {
            let result = [];
            if (snapshot) {
              result = Object.keys(snapshot).map(function (index) {
                let row = [];
                if (keyRef) {
                  row = snapshot[index];
                  row["key"] = index;
                } else {
                  let rowsGallery = snapshot[index];

                  row["key"] = index;
                  row["data"] = rowsGallery;
                }
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
