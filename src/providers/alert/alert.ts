import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class AlertProvider {
  okText = "ok";
  alertText = "Alert";

  constructor(
    public alertCtrl: AlertController,
    /*  translate: TranslateService,*/
  ) {

    /*  translate.get(this.okText).subscribe((res) => {
        this.okText = res;
      });
      translate.get(this.alertText).subscribe((res) => {
        this.alertText = res;
      });*/

  }

  show(text) {
    let alert = this.alertCtrl.create({
      title: this.alertText,
      subTitle: text,
      buttons: [this.okText]
    });
    alert.present();
  }

  showWithTitle(text, title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [this.okText]
    });
    alert.present();


  }

  showAlertPersonalice(params) {
    let title = params.title ? params.title : "Opciones"
    let message = params.title ? params.message : "Message";

    let buttons = params.buttons?params.buttons:null
    let configAlert = {
      title: title,
      message: message,
    };
    if (buttons) {
      configAlert["buttons"] = buttons;
    }
    let alert = this.alertCtrl.create(configAlert);
    alert.present();
  }
}
