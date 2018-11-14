import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ConfigProvider} from "../providers/config/config";
import {normalizeURL} from "ionic-angular";
import {FileChooser} from "@ionic-native/file-chooser";
import {FileOpener} from "@ionic-native/file-opener";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Base64} from '@ionic-native/base64';

@Injectable()
export class ManagementFilesService {


  constructor(
    private fileChooser: FileChooser,
    private fileOpener: FileOpener,
    private filePath: FilePath,
    public file: File,
    public config: ConfigProvider,
    private camera: Camera,
    private base64: Base64
  ) {

  }

  chooseImageGallery(params): Observable<any> {
    let sourceType = params.sourceType;//camera=0,1=gallery
    let createRegister = params.createRegister;
    const options: CameraOptions = {
      quality: params.quality ? params.quality : 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      /* allowEdit: false,*/
      targetWidth: params.targetWidth ? params.targetWidth : 100,
      targetHeight: params.targetHeight ? params.targetHeight : 100,
      saveToPhotoAlbum: params.saveToPhotoAlbum ? params.saveToPhotoAlbum : false,
      correctOrientation: params.correctOrientation ? params.correctOrientation : true
    }
    if (sourceType == 1) {
      options["sourceType"] = this.camera.PictureSourceType.PHOTOLIBRARY;
    }
    return new Observable(observer => {

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let chooseEvent = false;
        if (!createRegister) {
          chooseEvent = true;
        }
        let image = 'data:image/jpeg;base64,' + imageData;
        let path;
        path = normalizeURL(imageData);
        let dirPath = path;
        let dirPathSegments = dirPath.split("/");
        dirPathSegments.pop();
        dirPath = dirPathSegments.join("/");
        let result = {
          msj: "Ok resolveLocalFilesystemUrl",
          result: {
            dirPath: dirPath,
            dirPathSegments: dirPathSegments,
            url: image,
            name: "",
            chooseEvent: chooseEvent
          }
        };
        observer.next(result);
        // console.log(base64Image);
        observer.next(result);
        observer.complete();
      }, (error) => {
        let result = {
          msj: "Error cAM",
          error: error
        };
        observer.error(result);
        observer.complete();
      });

    });
  }

  chooseFile(createRegister: boolean = false): Observable<any> {
    return new Observable(observer => {
      this.fileChooser.open().then(uri => {
        this.filePath.resolveNativePath(uri).then(uriResolve => {
          this.file.resolveLocalFilesystemUrl(uriResolve).then(newUrl => {
            let chooseEvent = false;
            if (!createRegister) {
              chooseEvent = true;
            }
            let dirPath = newUrl.nativeURL;
            let dirPathSegments = dirPath.split("/");
            dirPathSegments.pop();
            dirPath = dirPathSegments.join("/");
            let path = newUrl.toURL();
            path = normalizeURL(path);
            this.base64.encodeFile(path).then((base64File: string) => {
              this.generateFromImage(base64File, 200, 200, 0.5, data => {
                let result = {
                  msj: "Ok resolveLocalFilesystemUrl",
                  objects: {
                    newUrl: newUrl,
                    uri: uri,
                  },
                  result: {
                    dirPath: dirPath,
                    dirPathSegments: dirPathSegments,
                    url: path,
                    name: newUrl.name,
                    chooseEvent: chooseEvent,
                    base64File: data,
                    img: 'data:image/jpeg;base64,' + base64File
                  }
                };

                observer.next(result);
                observer.complete();
              });



            }, (error) => {
              let result = {
                msj: "Error resolveNativePath",
                error: error
              };
              observer.error(result);
              observer.complete();
            });

          }, error => {
            let result = {
              msj: "Error resolveLocalFilesystemUrl",
              error: error
            };
            observer.next(result);
            observer.complete();
          })
        }, error => {
          let result = {
            msj: "Error resolveNativePath",
            error: error
          };
          observer.error(result);
          observer.complete();
        });


      }, error => {
        console.log("eRROR OPEN", error);
        /* let result = {
           msj:error,
           error: error
         };
         observer.next(result);
         observer.complete();*/
      })


    });

  }

  managementGenerateBuffer(params) {
    let dirPath = params.img.dirPath;
    let name = params.img.name;
    return new Observable(observer => {
      this.file.readAsArrayBuffer(dirPath, name).then(async buffer => {
        await observer.next(buffer);
        observer.complete();
      }, error => {
        let result = {
          msj: "Error readAsArrayBuffer",
          error: error
        }
        observer.next(result);
        observer.complete();
      })
    });
  }
  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();

    image.onload = () => {
      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl)
    }
    image.src = img;
  }
}
