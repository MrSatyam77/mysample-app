// External Imports
import { Injectable } from '@angular/core';

// Internal Imports
import { CommonAPIService, ResellerService, MediaService } from "@app/shared/services/index";
import { environment } from "@environments/environment";
import { APINAME } from "@app/shared/shared.constants";
import { TaxIdleConfigService } from '@app/shared/directives/tax-idle-config.service';

@Injectable({
  providedIn: 'root'
})

export class AppInitializerService {

  constructor(private _commonAPIService: CommonAPIService,
    private _resellerService: ResellerService,
    private _mediaService: MediaService,
    private _taxIdleConfigService: TaxIdleConfigService
  ) { }


  /**
   * @author Hannan Desai
   * @description
   *        This function will hold all pre bootstrap actions required
   */
  public performPreBootstrapAction() {
    return new Promise((resolve, reject) => {
      //Load reseller configuration
      this._resellerService.init().then((response) => {
        // reseller style dashboard css
        this.getResellerStyleDashboard().then((result) => {
          // append dashboard style after less loaded
          // this.appendDashboardCSS();
          // to init tracking fro user.
          this._mediaService.initTracking();
          // configuration for idle directive
          this._taxIdleConfigService.setIdleTimeForTaxIdle(30);
          this._taxIdleConfigService.setWarningTimeForTaxIdle(2);
          //configuration for tax session 24 directive
          this._taxIdleConfigService.seIintervalTimeForTaxSession(1);
          this._taxIdleConfigService.setWarningTimeForTaxSession(30);
          resolve(true);
        }, (error) => {
          reject(error);
        })
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        Dashboard CSS (Reseller CSS) - START
   *        Load CSS from server (preprocess less as per reseller preferences)			
   */
  private getResellerStyleDashboard() {
    return new Promise((resolve, reject) => {
      if (environment.reseller_config_global) {
        this._commonAPIService.getPromiseResponse({
          apiName: APINAME.GET_RESELLER_STYLE_DASHBOARD,
          parameterObject: { resellerId: environment.reseller_config_global.appId }
        }).then((result) => {
          if (result) {
            let dashboardCSS = document.createElement('style');
            dashboardCSS.id = "dashboardStyle";
            dashboardCSS.innerHTML = result.data;
            document.body.appendChild(dashboardCSS);
          }
          resolve(true);
        }, (error) => {
          reject(error);
        })
      } else {
        resolve(true);
      }
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        Load CSS file for media queries related to dashboard
   *        TODO: As we need this to be injected after actual css (less), we have written here.
   *        Please find alternate solution as this will block application startup until this css get loaded
   */
  private appendDashboardCSS() {
    const linkEl = document.createElement("link");
    linkEl.id = "dashboardMediaStyle"
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("type", "text/css");
    linkEl.setAttribute("href", "taxAppJs/home/css/dashboard.css");
    document.body.appendChild(linkEl);
  }
}
