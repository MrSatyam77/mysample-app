import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-ssn',
  templateUrl: './change-ssn.component.html',
  styleUrls: ['./change-ssn.component.scss']
})
export class ChangeSsnComponent implements OnInit {

  public data: any;
  public changeSSNForm: FormGroup;
  constructor(private messageService: MessageService, private myTaxportalService: MyTaxportalService, private activeModal: NgbActiveModal, private fb: FormBuilder) { }

  /**
   * @author Ravi Shah
   * Close the Dialog
   * @memberof PreviewMailComponent
   */
  public close() {
    this.activeModal.close();
  }

  /**
   * @author Ravi Shah
   * Change SSN
   * @memberof ChangeSsnComponent
   */
  changeSSN() {
    let apiParam = this.changeSSNForm.value;
    let existingClient = this.data.allClients.filter((obj) => {
      return obj.SSN === apiParam.newSSN && obj.clientId !== apiParam.clientId;
    })
    const self = this;
    if (!(existingClient && existingClient.length > 0)) {
      if (apiParam.newSSN === apiParam.oldSSN) {
        this.messageService.showMessage('Please change SSN in order to update.', 'info');
      } else {
        self.myTaxportalService.changeSSN(apiParam).then(function (response) {
          self.activeModal.close(apiParam.newSSN);
        }, function (error) {
        });
      }
    } else {
      this.messageService.showMessage('This SSN is associated with another client.', 'error');
    }
  }

  /**
   * @author Ravi Shah
   * Initialize Invitation Email Component
   * @private
   * @memberof ResendInvitationEmailComponent
   */
  private initailizeChangeSSNForm(dataItem) {
    this.changeSSNForm = this.fb.group({
      clientId: [dataItem.clientId, [Validators.required]],
      newSSN: [dataItem.SSN, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      oldSSN: [dataItem.SSN, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    })
  }

  ngOnInit() {
    this.initailizeChangeSSNForm(this.data.clientData);
  }

}