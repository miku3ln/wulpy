import {Injectable} from '@angular/core';
import {ConfigProvider} from '../../providers/config/config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import {count} from "rxjs/operator/count";
import {DataManagerProvider} from "../data-manager/data-manager";

@Injectable()
export class DataManagerTemplateProvider {
  private apiUrlBackend: string;
  private urlGetBanners = "getBanners";
  private urlGetAllPages = "getAllPages";

  constructor(
    public http: HttpClient,
    public config: ConfigProvider,
    private storage: Storage,
    public dataManager: DataManagerProvider
  ) {
    this.apiUrlBackend = this.config.url;
  }

  initGettingAllBanners(): Observable<Object> {
    return this.dataManager.get(this.urlGetBanners);
  }

  initGetAllPages(params): Observable<Object> {
    return this.dataManager.get(this.urlGetAllPages, params);
  }

  initGeAllProducts(params): Observable<Object> {
    return this.dataManager.get("getAllProducts", params);

  }

  initGetAlCategories(params): Observable<Object> {
    return this.dataManager.get("allCategories", params);

  }


}
