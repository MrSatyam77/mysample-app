// External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Internal Imports
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';
@Component({
  selector: 'app-office-settings',
  templateUrl: './office-settings.component.html',
  styleUrls: ['./office-settings.component.scss']
})

export class OfficeSettingsComponent implements OnInit {

  public officeAdvanceSettings: { associatedWithServiceBureau?: boolean } = { associatedWithServiceBureau: undefined }; 


  constructor(private router: Router,
    private _officeService: OfficeService,
    private _messageService: MessageService) { }

    /**
   * @author Satyam Jasoliya
   * @description
   *          Used to get customer details.
   */
  public getCustomerDetail() {
    this._officeService.getCustomerDetails().then((result: any) => {
      this.officeAdvanceSettings.associatedWithServiceBureau = result.associatedWithServiceBureau;
    })
  }

  /**
   * @author Satyam Jasoliya
   * @description
   *          Used to updated customer details.
   */

  public updateCustomerDetail(property: string) {
    let parameterObject;
    if (property === "associatedWithServiceBureau") {
      parameterObject = { associatedWithServiceBureau: this.officeAdvanceSettings.associatedWithServiceBureau };
    }
    if (parameterObject) {
      this._officeService.saveCustomerDetail(parameterObject).then((result) => {
        this._messageService.showMessage("Updated successfully.", "success");
      })
    }
  }

  /**
   * @author Satyam Jasoliya
   * @description
   *          Used to go back home page.
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    this.getCustomerDetail();
  }

}
