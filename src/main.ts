// External Imports
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { setAngularJSGlobal } from "@angular/upgrade/static";
import * as angular from "angular";


import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey("[TRIAL]_20_November_2019_[v2]_MTU3NDIwODAwMDAwMA==cb1b5d0f20d0a992c41a506b89b828c1");

// Internal Imports
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// to use angularJs global variable in angular root folder too.
declare var angular: angular.IAngularStatic;
setAngularJSGlobal(angular);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
