import {Injectable} from '@angular/core';
import {ConfigProvider} from '../../providers/config/config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import {count} from "rxjs/operator/count";

@Injectable()
export class DataManagerProvider {
  private apiUrlBackend: string;

  constructor(public http: HttpClient, public config: ConfigProvider,private storage: Storage,) {
    this.apiUrlBackend = this.config.url;
  }
  get(urlAction: string, params: any = {}): Observable<Object> {
    let urlRequest = this.apiUrlBackend + urlAction;
    return this.http.get(urlRequest, {params: params})
      .map(result => {
        return result;
      })
      .catch(err => {
          return err;
        }
      );
  }

  post(urlAction: string, params: any = {},options:any={}) {
    let urlRequest = this.apiUrlBackend + urlAction;
    return this.http.post(urlRequest, params, options)
      .map(result => {
        return result;
      })
      .catch(err => {
          return err;
        }
      );
  }
  postCustom(urlAction: string, params: any = {}){
    return this.http.post(urlAction, params, {params: params})
      .map(result => {
        return result;
      })
      .catch(err => {
          return err;
        }
      );
  }
  saveLocal(nameKey:string,items:any[]){
    this.storage.set(nameKey,items);

  }
  getLocal(nameKey:string){

    let data=this.storage.get(nameKey).then(data=>data).catch(error=>error);
    return data;
  }
  deleteLocal(nameKey:string){
    this.storage.remove(nameKey).then(data=>data).catch(error=>error);
  }


}
