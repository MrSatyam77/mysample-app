//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal imports
import { PreloadCheckService } from '@app/authentication/preload-check.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-preload-check',
  templateUrl: './preload-check.component.html',
  styleUrls: ['./preload-check.component.scss']
})

export class PreloadCheckComponent implements OnInit {
  // hold supported browser list
  browserSupportList = [];

  constructor(
    private preLoadService: PreloadCheckService,
    private _activeModal: NgbActiveModal) { }

  /**
  * @author Heena Bhesaniya
  *  @description If user wants to proceed further even when their browser is not supported.
  */
  forceBrowserSupport() {
    this.preLoadService.setBrowserSupport(true);
    let pcConfig = this.preLoadService.getPCConfig();
    let self = this;
    self.preLoadService.markBrowserSupport(pcConfig).then(() => {
      self.close();
    }, (error) => {
      console.error(error);
    });
  }

  /**
	 * @author Heena Bhesaniya
   *  @description close dialog method
   */
  close() {
    this._activeModal.close(false);
  }

  /**
	 * @author Heena Bhesaniya
	 * @description store browser supported list
	 */
  ngOnInit() {
    let browserDetails = this.preLoadService.getUserAgentDetails();
    if (browserDetails.support && browserDetails.support.length > 0) {
      this.browserSupportList = browserDetails.support;
      for (let index in this.browserSupportList) {
        this.browserSupportList[index].os = browserDetails.os;
      }
    } else {
      // For which we doesnot support they will see all the details
      this.browserSupportList = [];
      if (environment.reseller_config_global && environment.reseller_config_global.browserSupport) {
        for (let os in environment.reseller_config_global.browserSupport) {
          for (let browsers in environment.reseller_config_global.browserSupport[os]) {
            let obj = environment.reseller_config_global.browserSupport[os][browsers];
            let isExists = this.browserSupportList.findIndex(function (t) { return obj.browser.indexOf(t.browser) > -1 })
            if (isExists === -1) {
              obj.os = os;
              this.browserSupportList.push(obj);
            } else {
              this.browserSupportList[isExists].os += " / " + os
            }
          }
        }
      }
    }
  }
}
