import {Injectable} from '@angular/core';
import {Network} from "@ionic-native/network";
import {ConfigProvider} from "../providers/config/config";
import {Platform} from "ionic-angular";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ConnectivityService {
  onDevice: boolean;
  status: boolean = false;
  constructor(
    public network: Network,
    public config: ConfigProvider,
    public platform: Platform
  ) {
    this.onDevice = this.platform.is('cordova');
    this.initEventsEmitStatus().subscribe(result => {
      let status = result.data.status;
      this.status = true;
      this.config.statusNetwork = status;
      this.status = status;
      console.log("initEventsEmitStatus SUCCESS", this.status);
    }, error => {
      console.log("initEventsEmitStatus ERROR", error.msj);
      this.status = true;
      this.config.statusNetwork = true;
      this.status = true;
    })
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type != 'none';
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type == 'none';
    } else {
      return !navigator.onLine;
    }
  }

  watchOnline(): any {
    return this.network.onConnect();
  }

  watchOffline(): any {
    return this.network.onDisconnect();
  }

  initEventsEmitStatus(): Observable<any> {
    return new Observable(observer => {

      this.network.onDisconnect().subscribe(
        statusResult => {
          let statusNetwork = true;
          if (statusResult.type == "offline") {
            statusNetwork = false;
          }
          let result = {
            msj: "Success onDisconnect",
            data: {
              statusResultObj: statusResult,
              status: statusNetwork
            },
          }
          observer.next(result);
        }, error1 => {
          let result = {
            msj: "Error onDisconnect",
            error: error1,
          }
          observer.error(result);
        });
      this.network.onConnect().subscribe(
        statusResult => {
          let statusNetwork = true;
          if (statusResult.type == "offline") {
            statusNetwork = false;
          }
          this.config.statusNetwork = statusNetwork;
          this.status = statusNetwork;
          let result = {
            msj: "Success onConnect",
            data: {
              statusResultObj: statusResult,
              status: statusNetwork
            },
          }
          observer.next(result);

        }, error1 => {
          let result = {
            msj: "Error onConnect",
            error: error1,
          }
          observer.error(result);
        });
     /* this.network.onchange().subscribe(
        statusResult => {
          let statusNetwork = true;
          if (statusResult.type == "offline") {
            statusNetwork = false;
          }
          this.config.statusNetwork = statusNetwork;
          this.status = statusNetwork;

          let result = {
            msj: "Success onchange",
            data: {
              statusResultObj: statusResult,
              status: statusNetwork
            },
          }
          observer.next(result);
        }, error1 => {
          let result = {
            msj: "Error onConnect",
            error: error1,
          }
          observer.error(result);
        });*/
    });
  }


}
