// external imports
import { Component, OnInit, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Internal imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/shared/shared.constants';
import { UtilityService } from '@app/shared/services/utility.service';

@Component({
  selector: 'app-updatedterms',
  templateUrl: './updatedterms.component.html',
  styleUrls: ['./updatedterms.component.scss']
})
export class UpdatedtermsComponent implements OnInit {
  public buttonText: string; // To display button text
  public isAgreeToTerms: boolean; // to bind value
  constructor(private modalInstance: NgbActiveModal, private commonApiService: CommonAPIService, private injector: Injector) { }
  /**
   * @author om kanada
   * @description
   *  This function is used to close dialog ans call api to update terms of user
   */
  public close(): void {
    const utilityService = this.injector.get(UtilityService);
    const deviceInformations = utilityService.getDeviceInformation();
    this.buttonText = 'Processing...';
    // tslint:disable-next-line:max-line-length
    this.commonApiService.getPromiseResponse({ apiName: APINAME.UPDATE_TERMS_OF_USER, parameterObject: { deviceInformation: deviceInformations } }).then((response) => {
      //  close dialog
      this.modalInstance.close(false);
    }, (error) => {
      //  close dialog
      this.modalInstance.close(close);
    });

  }
  ngOnInit() {
    this.buttonText = 'Ok';
  }

}
