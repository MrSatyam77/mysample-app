// External Imports
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from "@ngx-loading-bar/core";
import * as angular from "angular";
import * as Raven from 'raven-js';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Internal Imports
import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { InterceptedHttp } from "@app/shared/interceptors/http.interceptor";
import { CustomErrorHandler } from "@app/shared/interceptors/error.handler";
import { SharedModule } from '@app/shared/shared.module';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { AppInitializerService } from '@app/shared/services/app-initializer.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
declare var angular: angular.IAngularStatic;
import { PreloadCheckComponent } from '@app/authentication/dialogs/preload-check/preload-check.component';

// Installing Sentry if it is not a local enviroment
if (environment.mode !== 'local') {
  Raven.config(environment.sentry_project_url, {
    release: environment.sentry_project_token
  }).install();
}

export function performPrebootstrapActions(appInitializerService: AppInitializerService, authService: AuthenticationService) {
  return () => appInitializerService.performPreBootstrapAction().then(() => {
    return authService.createSession(true);
  });
}


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    PreloadCheckComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    ServiceWorkerModule.register('sw-mtpo.js', { enabled: environment.production }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptedHttp,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: performPrebootstrapActions,
      deps: [AppInitializerService, AuthenticationService],
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PreloadCheckComponent]
})
export class AppModule { }
