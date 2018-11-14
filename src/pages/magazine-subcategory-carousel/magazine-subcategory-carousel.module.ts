import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagazineSubcategoryCarouselPage } from './magazine-subcategory-carousel';

@NgModule({
    declarations: [
      MagazineSubcategoryCarouselPage,
    ],
    imports: [
        IonicPageModule.forChild(MagazineSubcategoryCarouselPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MagazineSubcategoryCarouselPageModule { }
