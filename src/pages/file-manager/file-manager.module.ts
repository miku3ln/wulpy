import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FileManagerPage} from './file-manager';
import {ListBigImageDataComponent} from "../../components/list-view/expandable/list-big-image-data/list-big-image-data";


@NgModule({
  declarations: [
    FileManagerPage,
    ListBigImageDataComponent
  ],
  imports: [
    IonicPageModule.forChild(FileManagerPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})

export class FileManagerPageModule {
}
