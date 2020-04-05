//External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { ReturnAPIService } from '@app/return/return-api.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-proforma-check',
  templateUrl: './proforma-check.component.html',
  styleUrls: ['./proforma-check.component.scss']
})
export class ProformaCheckComponent implements OnInit {

  // isProcessing and isError are scope variable present in performaDialog.html file which is used to show processing button enable or disable based on response and 
  public isProcessing: boolean = false;
  // isError shows error message if proforma for the previous year return not created successfully .
  public isError: boolean = false;
  //take dialog input data
  @Input() data;

  constructor(
    private _returnAPIService: ReturnAPIService,
    private _ngbActiveModal: NgbActiveModal,
    private _messageService: MessageService) { }

  /**
   * @author Heena Bhesaniya  
   * @description This function is used to close dialog.
   */
  public close() {
    if (this.isError !== true) {
      this._ngbActiveModal.close(false);
    } else {
      this._ngbActiveModal.dismiss("dismissed");
    }
  }

  /**
  * @author Heena Bhesaniya  
  * @description This funbction is used to call peforma new return api
  */
  public proformaOrNewReturn() {
    const self = this;
    self.isProcessing = true;
    if (self.isError != true) {
      self._returnAPIService.proformaOnNewReturn(self.data).then(function (id) {
        self.isProcessing = false;
        if (id == "Fail") {
          // If user not get response then makes self.isError = true which shows the following message : 
          //Proforma for a prior year return was unsuccessfull. Do you want to create a new return ?
          self.isError = true;
        } else {
          self._messageService.showMessage('Proforma for a prior year return created successfully.', 'success');
          self._ngbActiveModal.close(id);
        }
      }, function (error) {
        self.isProcessing = false;
        console.error(error);
      });
    } else {
      self._ngbActiveModal.close(false);
    }
  };

  ngOnInit() { }

}
