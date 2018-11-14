import {ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {AppSettings} from './app-settings'

@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) {
  }

  presentToast(message: string, params: any = null) {
    let toastItem = AppSettings.TOAST;
    if (params) {
      if (params.duration) {

        toastItem["duration"] = params.duration;
      }
      if (params.position) {

        toastItem["position"] = params.position;
      }
    }

    toastItem["message"] = message;
    let toast = this.toastCtrl.create(toastItem);
    toast.present();
  }
}
