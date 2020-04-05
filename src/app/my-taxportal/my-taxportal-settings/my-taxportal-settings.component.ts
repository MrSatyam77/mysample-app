/** External import */
import { Component, OnInit } from '@angular/core';
/** Internal import */
import { MyTaxportalService } from "../my-taxportal.service";
import { Router } from '@angular/router';
import { UserService } from '@app/shared/services';

@Component({
  selector: 'app-my-taxportal-settings',
  templateUrl: './my-taxportal-settings.component.html',
  styleUrls: ['./my-taxportal-settings.component.scss']
})
export class MyTaxportalSettingsComponent implements OnInit {

  public settings: any = {};
  public isApiCalled: any = false;
  public showSettingMenuBasedOnTaxYear: boolean;
  public taxYear: any;

  constructor(private userService: UserService, private myTaxportalService: MyTaxportalService, private router: Router) { }

  /**
   * @author Ravi Shah
   * Call on Settings Change
   * @memberof MyTaxportalSettingsComponent
   */
  public updateEmailTemplate() {
    let renderEle = document.getElementById('render-email-template')
    if (renderEle) {
      if (this.settings.emailTemplates) {
        renderEle.innerHTML = this.settings.emailTemplates[0].body;
      } else {
        renderEle.innerHTML = '';
      }
      var companyEle = renderEle.getElementsByTagName('span');
      if (companyEle && companyEle.length > 0) {
        companyEle[0].innerHTML = this.settings.companyName ? this.settings.companyName : '&lt;Tax Preparer Company Name&gt;';
      }
      var ele = document.getElementById('render-email-template').innerHTML;
      this.settings.emailTemplates[0].body = ele;
    }
  }

  /**
   * @author Ravi Shah
   * Go Redirects to the dashboard
   * @memberof MyTaxportalSettingsComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * @author Ravi Shah
   * Get Client Portal Settings
   * @private
   * @memberof MyTaxportalSettingsComponent
   */
  private getSettings() {
    this.isApiCalled = true;
    this.myTaxportalService.getSettings().then((result: any) => {
      this.settings = result;
      this.updateEmailTemplate();
      this.isApiCalled = false;
    }, error => {
      this.isApiCalled = false;
    })
  }

  ngOnInit() {
    this.isApiCalled = true;
    this.taxYear = this.userService.getTaxYear();
    this.showSettingMenuBasedOnTaxYear = this.myTaxportalService.canClientPortalAccess();
    if (this.showSettingMenuBasedOnTaxYear) {
      this.getSettings();
    } else {
      this.isApiCalled = false;
    }
  }
}
