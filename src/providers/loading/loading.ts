// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';
import {ConfigProvider} from '../config/config';

@Injectable()
export class LoadingProvider {
  loading;

  constructor(
    public loadingCtrl: LoadingController,
    public config: ConfigProvider,
  ) {

  }

  show(timeInfinity = false) {
    if (timeInfinity) {

      this.loading = this.loadingCtrl.create();
    } else {
      this.loading = this.loadingCtrl.create({
        duration: 1000
      });

    }
    this.loading.present();
  }

  hide() {
    try {
      this.loading.dismiss();
    } catch (error) {
    }


  }

  autoHide(time) {
    this.loading = this.loadingCtrl.create({
      duration: time
    });
    this.loading.present();
  }
}
