import {AngularFireDatabase} from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './app-settings'
import {ConfigProvider} from "../providers/config/config";
import firebase from 'firebase';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';

@Injectable()
export class FirebaseStorageService {
  public pathOrRef: string = AppSettings.pathOrRef["about-us"];
  public paramsPage: Array<any>;
  public fullPathCategories = "app/catalogs/categories";
  public fullPathSubCategories = "app/catalogs/subcategories";
  public fullPathGallery = "app/gallery";
  public fullPathContactUsItemManagement = "pages/about-us/items";

  public fullPathDbCatalogs = "catalogs";

  constructor(public db: AngularFireDatabase, public config: ConfigProvider, public afStorage: AngularFireStorage) {

  }

  uploadImage(buffer, fullPath) {
    let blob = new Blob([buffer], {type: "image/jpeg"});
    let storage = firebase.storage();
    return storage.ref(fullPath).put(blob);
  }

  getPhotoUrl(fullPath) {

    return firebase.storage().ref(fullPath).getDownloadURL();
  }

  removeDataStorage(fullPath) {
    var storage = firebase.storage();
    var storageRef = storage.ref(fullPath);

// Delete the file

    /*.then(function () {
        // File deleted successfully
      }).catch(function (error) {
        // Uh-oh, an error occurred!
      });*/
    return storageRef.delete();

  }

  putCategorieData(params: any = null) {
    let path = AppSettings.pathOrRef["categories"]; // Endpoint on firebase
    let data = params;
    return this.db.list(path).push(data);
  }


  updateCategorieData(params): Promise<any> {
    let key = params.key;
    let path = AppSettings.pathOrRef["categories"] + "/" + key;
    let data = params.data;
    return this.db.object(path).update(data);
  }

  deleteFile(params) {
    let storagePath = params.fullPath;
    return this.db.object(storagePath).remove();
  }

  updateSubCategorieData(params): Promise<any> {
    let key = params.key;
    let path = AppSettings.pathOrRef["subcategories"] + "/" + key;
    let data = params.data;
    return this.db.object(path).update(data);
  }

  putSubCategorieData(params: any = null) {
    let path = AppSettings.pathOrRef["subcategories"]; // Endpoint on firebase
    let data = params;
    return this.db.list(path).push(data);
  }

  updateGallery(params): Promise<any> {
    let key = params.key;
    let parentKey = params.parentKey;

    let path = AppSettings.pathOrRef["gallery"] + "/" + "/" + parentKey + "/" + key;
    let data = params.data;
    return this.db.object(path).update(data);
  }

  putGalleryData(params: any = null) {
    let keySubcategory = params.key;
    let path = AppSettings.pathOrRef["gallery"] + "/" + keySubcategory; // Endpoint on firebase
    let data = params;
    return this.db.list(path).push(data);
  }


  putAboutUsItemData(params: any = null) {
    let path = AppSettings.pathOrRef["about-us"] + "/items/"; // Endpoint on firebase
    let data = params;
    return this.db.list(path).push(data);
  }


  updateAboutUsItemData(params): Promise<any> {
    let key = params.key;
    let path = AppSettings.pathOrRef["about-us"] + "/items/" + key;
    let data = params.data;
    return this.db.object(path).update(data);
  }
}
