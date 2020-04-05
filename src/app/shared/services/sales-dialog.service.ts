// External imports
import { Injectable, Injector } from '@angular/core';

// Internal imports
import { DialogService } from '@app/shared/services/dialog.service';
import { SalesDialogComponent } from '@app/shared/components/sales-dialog/sales-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class SalesDialogService {
  // content configuration
  private contentForDialog = {
    'subscription': { 'title': 'Purchase a MyTAXPrepOffice Plan', 'message': 'To purchase a MyTAXPrepOffice Plan, please complete the Registration process by clicking on the “Register Now” button. Click on “Continue with Demo Account” to return to the previous screen.' },
    'conversion': { 'urls': ['/conversion/list', '/conversion/new'], 'title': 'Conversion Testing', 'message': 'You are currently using the demo version of MyTAXPrepOffice. We would be glad to offer you the opportunity to test our conversion by first registering for a free MyTAXPrepOffice account. You will then be able to upload as many prior-year clients as you would like.' },
    'writeToUs': { 'urls': ['/manage/support/email'], 'title': ' Contacting Support', 'message': 'If you would like to ask us a question, you will need to register so we can get you a response.' },
    'user': { 'urls': ['/manage/user/edit'], 'title': 'Additional Users', 'message': 'Because additional users are setup with an email address, you need to register to test the additional user functionality.' },
    'bankEPS': { 'urls': ['/bank/eps'], 'title': 'Enrolling with EPS', 'message': 'We can only receive and process enrollment requests from registered customers.' },
    'bankEPAY': { 'urls': ['/bank/epay'], 'title': 'Enrolling with EPAY', 'message': 'We can only receive and process enrollment requests from registered customers.' },
    'bankATLAS': { 'urls': ['/bank/atlas', '/bank/atlas/result'], 'title': 'Enrolling with ATLAS', 'message': 'We can only receive and process enrollment requests from registered customers.' },
    'bankTPG': { 'urls': ['/bank/tpg'], 'title': 'Enrolling with TPG', 'message': 'We can only receive and process enrollment requests from registered customers.' },
    'protectionPlus': { 'urls': ['/bank/protectionPlus'], 'title': 'Enrolling with Protection Plus', 'message': 'We can only receive and process enrollment requests from registered customers.' },
    'printing': { 'title': 'Printing', 'message': 'If you would like to print a return, please register for a free account.' }
  }
  constructor(private injector: Injector) { }
  
  /**
   * @author Om kanada
   * @description
   *  To opensales Dialof For Demo user
   */
  public openSalesDialog(path: string): void {
    let content = this.contentForDialog[path];
    if (!content) {
      content = { title: 'Register Now', message: 'To use this functionality you need to first register with us.' };
    }
    const dialogService = this.injector.get(DialogService);
    dialogService.custom(SalesDialogComponent, { content: content }, {});

  }
}
