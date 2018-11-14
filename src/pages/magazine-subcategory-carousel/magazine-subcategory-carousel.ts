import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the MagazineSubcategoryCarouselPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-magazine-subcategory-carousel',
  templateUrl: 'magazine-subcategory-carousel.html',
})
export class MagazineSubcategoryCarouselPage {
  public slides = [];
  public subcategoryData: any;
  public title: string = "Galería";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.subcategoryData = navParams.get('data');
    this.slides = this.subcategoryData.galleryData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MagazineSubcategoryCarouselPage');
  }

}
