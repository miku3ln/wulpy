import {Injectable} from '@angular/core';


@Injectable()

export class BranchIoManagementProvider {
  public uploadGooglePlayStore = true;
  public uri_scheme = "wulpyms";
  public link_domain = "eccomerce-x.app.link";
  public params: any;
  public dataSession: Array<any> = [];
  nav: any;
  public Branch: any;
  // ---SERVER REDIRECTION--
  public canonicalUrl: string = "http://www.wulpyestodo.com/";
  public canonicalUrlAndroid: string = this.uploadGooglePlayStore ? "https://play.google.com/store/apps/details?id=com.tryoniarts.brickbreakerplus" : "https://www.youtube.com/watch?v=PvA5AOMsNsA";

  public canonicalIdentifier: string = "content/wulpy";
  public title: string = "Wulpy App";
  public contentDescription: string = "Aplicación que te permitira seguire nuestras actividades.";
  // https://docs.branch.io/pages/deep-linking/routing/
  public contentImageUrl: string = "https://scontent.fatf1-1.fna.fbcdn.net/v/t1.0-9/30594760_177990546186835_3348408640569606144_n.png?_nc_cat=107&oh=bb637acea1eb2643e1bf3501d1a058fc&oe=5C544F96";
  public contentIndexingMode: string = "public";

  constructor() {
    console.log('Hello BranchIoManagementProvider Provider');
  }

  initBranchIoSession() {
    this.Branch = window["Branch"];
    // for development and debugging only
    this.Branch.setDebug(true);
    return this.Branch.initSession();
  }


  // https://docs.branch.io/pages/deep-linking/routing/
  //Branch-added parameters¶
  getTypeLink(res) {
    var typeRes;
    if (res["+clicked_branch_link"]) {
      typeRes = "+clicked_branch_link";
      // Branch quick link: https://cordova.app.link/uJcOH1IFpM
      // Branch web link: https://cordova-alternate.app.link/uJcOH1IFpM
      // Branch dynamic link: https://cordova.app.link?tags=one&tags=two&tags=three&channel=Copy&feature=onboarding&stage=new+user&campaign=content+123+launch&type=0&duration=0&source=android&data
      // Branch uri scheme: branchcordova://open?link_click_id=link-500015444967786346
      // Branch android intent: intent://open?link_click_id=518106399270344237#Intent;scheme=looprocks;package=com.eneff.branch.cordovatestbed;S.browser_fallback_url=https%3A%2F%2Fcordova.app.link%2FuJcOH1IFpM%3F__branch_flow_type%3Dchrome_deepview%26__branch_flow_id%3D518106399312287278;S.market_referrer=link_click_id-518106399270344237%26utm_source%3DCopy%26utm_campaign%3Dcontent%20123%20launch%26utm_feature%3Donboarding;S.branch_data=%7B%22~feature%22%3A%22onboarding%22%2C%22this_is%22%3A%22true%22%2C%22custom_string%22%3A%22data%22%2C%22testing%22%3A%22123%22%2C%22%24publicly_indexable%22%3A%22false%22%2C%22%24desktop_url%22%3A%22http%3A%2F%2Fwww.example.com%2Fdesktop%22%2C%22%24one_time_use%22%3Afalse%2C%22custom_object%22%3A%22%7B%5C%5C%5C%22random%5C%5C%5C%22%3A%5C%5C%5C%22dictionary%5C%5C%5C%22%7D%22%2C%22~id%22%3A%22517795540654792902%22%2C%22~campaign%22%3A%22content%20123%20launch%22%2C%22%2Bclick_timestamp%22%3A1524764418%2C%22%2Burl%22%3A%22https%3A%2F%2Fcordova.app.link%2FuJcOH1IFpM%22%2C%22custom_boolean%22%3A%22true%22%2C%22custom%22%3A%22data%22%2C%22source%22%3A%22android%22%2C%22%24og_image_url%22%3A%22http%3A%2F%2Florempixel.com%2F400%2F400%2F%22%2C%22%2Bdomain%22%3A%22cordova.app.link%22%2C%22custom_integer%22%3A%221524690301794%22%2C%22~tags%22%3A%5B%22one%22%2C%22two%22%2C%22three%22%5D%2C%22custom_array%22%3A%22%5B1%2C2%2C3%2C4%2C5%5D%22%2C%22~channel%22%3A%22Copy%22%2C%22~creation_source%22%3A2%2C%22%24canonical_identifier%22%3A%22content%2F123%22%2C%22%24og_title%22%3A%22Content%20123%20Title%22%2C%22%24og_description%22%3A%22Content%20123%20Description%201524690296449%22%2C%22%24identity_id%22%3A%22453670943617990547%22%2C%22~stage%22%3A%22new%20user%22%2C%22%2Bclicked_branch_link%22%3Atrue%2C%22%2Bmatch_guaranteed%22%3Atrue%2C%22%2Bis_first_session%22%3Afalse%7D;B.branch_intent=true;end
      // Branch android app link (device controlled): https://cordova.app.link/uJcOH1IFpM
      // Branch ios universal link (device controlled): https://cordova.app.link/uJcOH1IFpM
    } else if (res["+non_branch_link"]) {
      typeRes = "+non_branch_link";
    } else {
      typeRes = "organically";
    }
    return typeRes;
  }

  createBranchUniversalObject(params) {
    // only canonicalIdentifier is required
    //Universal Object: https://docs.branch.io/pages/links/integrate/
    let canonicalIdentifier = params.canonicalIdentifier ? params.canonicalIdentifier : this.canonicalIdentifier;//*
    let canonicalUrl = params.canonicalUrl ? params.canonicalUrl : this.canonicalUrl;
    let title = params.title ? params.title : this.title;
    let contentDescription = params.contentDescription ? params.contentDescription : this.contentDescription;
    let contentImageUrl = params.contentImageUrl ? params.contentImageUrl : this.contentImageUrl;
    let price = params.price ? params.price : "";
    let currency = params.currency ? params.currency : "";
    let contentIndexingMode = params.contentIndexingMode ? params.contentIndexingMode : this.contentIndexingMode;
    let contentMetadata = params.contentMetadata ? params.contentMetadata : {
      custom: "data",
      testing: 123,
      this_is: true
    };

    let properties = {
      canonicalIdentifier: canonicalIdentifier,
      canonicalUrl: canonicalUrl,
      title: title,
      contentDescription: contentDescription,
      contentImageUrl: contentImageUrl,
      price: price,
      currency: currency,
      contentIndexingMode: contentIndexingMode,
      contentMetadata: contentMetadata
    };

// create a branchUniversalObj variable to reference with other Branch methods
    return this.Branch.createBranchUniversalObject(properties);
  }

  //https://docs.branch.io/pages/links/integrate/
  // Branch dynamic link:
  // https://cordova.app.link?tags=one&tags=two&tags=three&channel=Copy&feature=onboarding&stage=new+user&campaign=content+123+launch&type=0&duration=0
  getFormatDeepLinkByParams(paramsPDLA: object, paramsLDDLP: object = {}) {

    let objParamsDefault = Object.keys(paramsLDDLP).length > 0 ? paramsLDDLP : {
      channel: "facebook",
      feature: "onboarding",
      campaign: "content-123-launch",
      stage: "new-user"
    };

    let objPDLA_LDDLP: any = Object.assign(paramsPDLA, objParamsDefault);
    let urlObject = new URLSearchParams(objPDLA_LDDLP);
    let urlDeepLink = "https://" + this.link_domain + "/?" + urlObject.toString();
    return urlDeepLink;
  }


  getStringParamsByObj(ObjInfo: any) {
    let stringResult = "";//{key1:2,key2:2}  / key1=2&key2=2
    let lengthObj = Object.keys(ObjInfo).length;
    let lengthObjAux = 0;
    Object.keys(ObjInfo).map(function (key) {
      if (lengthObjAux < lengthObj - 1) {
        stringResult += key + "=" + ObjInfo[key] + "&";
      } else {
        stringResult += key + "=" + ObjInfo[key];
      }
      lengthObjAux++;
    });
    return stringResult;

  }

// ------------LINKS SHARE--
  getLinkShareDeepLinkByPage(page: string, paramsPDLA: object, paramsLDDLP: object = {}) {
    let urlShare = "";
    switch (page) {
      case 'home': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);
        break;
      }
      case 'newest': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);
        break;
      }
      case 'categories': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);

        break;
      }
      case 'products': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);

        break;
      }
      case 'productDetail': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);

        break;
      }
      case 'advertising': {
        //statements;
        urlShare = this.getFormatDeepLinkByParams(paramsPDLA, paramsLDDLP);

        break;
      }

    }
    return urlShare;
  }

  getPropertiesByType(typeShare, params: any = null) {


    let properties;
    switch (typeShare) {
      case "app":
        properties = {
          canonicalIdentifier: 'wulpyestodo/shareApp',
          canonicalUrl: this.canonicalUrl,
          title: 'Wulpy App',
          contentDescription: 'Promociona a tu empresa a traves de referidos , unete a nuestra app  ' + Date.now(),
          contentImageUrl: 'http://www.wulpyestodo.com/themes/themes_configuration/data/wulpy/sections/construccion/logo.png',
          contentIndexingMode: 'public',
          contentMetadata: {
            custom: 'data',
            testing: 123,
            this_is: true
          }
        };
      case "business":
        properties = {
          canonicalIdentifier: 'wulpyestodo/shareBusiness',
          canonicalUrl: this.canonicalUrl,
          title: params.title ? params.title : 'Empresa X',
          contentDescription: params.contentDescription?params.contentDescription:'Promociona a tu empresa a traves de referidos , unete a nuestra app  ',
          contentImageUrl:  params.contentImageUrl?params.contentImageUrl:'http://www.wulpyestodo.com/themes/themes_configuration/data/wulpy/sections/construccion/logo.png',
          contentIndexingMode: 'public',
          contentMetadata: params.contentMetadata?params.contentMetadata:{
            custom: 'data',
            testing: 123,
            this_is: true
          }
        };
    }

    return properties;
  }

  getPropertiesShortUrlByType(typeShare,params:any=null) {


    let properties;
    switch (typeShare) {
      case "app":
        properties = {
          $desktop_url: 'http://www.wulpyestodo.com/desktopConfig',
          $android_url: 'http://applivery.com/wulpyestodo',
          $ios_url: 'http://www.wulpyestodo.com/iosConfig',
          $ipad_url: 'http://www.wulpyestodo.com/ipadConfig',
          custom_string: 'data',
          custom_integer: Date.now(),
          custom_boolean: true
        };
      case "business":
        properties = {
          $desktop_url: 'http://www.wulpyestodo.com/desktopConfig',
          $android_url: 'http://applivery.com/wulpyestodo',
          $ios_url: 'http://www.wulpyestodo.com/iosConfig',
          $ipad_url: 'http://www.wulpyestodo.com/ipadConfig',
          custom_string: 'data',
          custom_integer: Date.now(),
          custom_boolean: true
        };
    }

    return properties;
  }

  getAnalyticsByType(typeShare,params:any=null) {
    let analytics;
    switch (typeShare) {
      case "app":
        analytics = {
          channel: 'wulpyApp',
          feature: 'share_app',//change
          campaign: 'Share app ,search users.',//change
          stage: 'New User',//
          tags: ['one', 'two', 'three']
        };
      case "business":
        analytics = {
          channel: 'wulpyApp',
          feature: 'share_business',//change
          campaign: 'Share Business ,search crm.',//change
          stage: 'Business Share',//
          tags: params.tags?params.tags:['one', 'two', 'three']
        };
    }
    return analytics;
  }

}

