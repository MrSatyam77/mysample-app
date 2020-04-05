import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  public data: any;


  constructor(private ngbActiveModal: NgbActiveModal, private messageService: MessageService, private myTaxportalService: MyTaxportalService) { }

  public close() {
    this.ngbActiveModal.close();
  }

  public saveClient() {
    let isSSNMatch = false;
    let isEmailMatch = false;
    if (this.data.allClients && this.data.allClients.length > 0) {
      for (var index in this.data.allClients) {
        if (this.data && this.data.allClients[index]) {
          if (this.data.allClients[index].SSN && this.data.SSN && this.data.allClients[index].SSN === this.data.SSN) {
            if (this.data.allClients[index].clientId !== this.data.clientId) {
              isSSNMatch = true;
            }
          }
          if (this.data.allClients[index].email && this.data.email && this.data.allClients[index].email.toLowerCase() === this.data.email.toLowerCase()) {
            if (this.data.allClients[index].clientId !== this.data.clientId) {
              isEmailMatch = true;
            }
          }
        }
      }
    }
    if (isSSNMatch === false && isEmailMatch === false) {
      delete this.data.allClients;
      this.myTaxportalService.saveClient(this.data).then((response) => {
        this.data.isDisabled = true;
        this.ngbActiveModal.close(this.data);
      });
    } else {
      if (isSSNMatch) {
        this.messageService.showMessage('Client with this SSN already exists.', 'error');
      } else if (isEmailMatch) {
        this.messageService.showMessage('Client with this Email already exists.', 'error');
      } else if (isSSNMatch && isEmailMatch) {
        this.messageService.showMessage('Client with this SSN & Email already exists.', 'error');
      }
    }
  }

  ngOnInit() {
  }

}
