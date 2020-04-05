import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  private systemInfo;
  private service = {
    reloadApplication: this.reloadApplication,
    getSystemInformation: this.getSystemInformation
  };
  constructor() { }

  //To reload browser
  //Default will be 'Ctrl+F5' , pass forceReload as false to have it 'F5' only.
  public reloadApplication(forceReload) {
    window.location.reload(forceReload == false ? false : true);
  }

  //To have system related information like, OS/Browser etc...
  public getSystemInformation(key) {
    //If system info is not already defined then define it first
    if (this.systemInfo == undefined) {
      this._generateSystemInfo();
    }

    //If Asked perticular information
    if (key != undefined) {
      return this.systemInfo[key];
    } else {
      return this.systemInfo;
    }

  }

  //Generate system information like, OS/Browser etc...
  public _generateSystemInfo() {
    //Reset to empty
    this.systemInfo = {};

    //OS Information 
    let _os = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) _os = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) _os = "mac";
    if (navigator.appVersion.indexOf("X11") != -1) _os = "unix";
    if (navigator.appVersion.indexOf("Linux") != -1) _os = "linux";

    this.systemInfo.os = _os;
  }
}
