import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  loading:any;
  constructor(private loadingCtrl: LoadingController) {}

  show() {
    this.loading = this.loadingCtrl.create({
        content: 'Espere Por favor'
    });
    this.loading.present();
  }

  hide() {
    this.loading.dismiss();
  }
}
