// External imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

// Internal imports
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {
  public content: any; // For store Content
  public data: any; // To get data From dialogService
  private currentPath: string; // To get current path
  constructor(private modalService: NgbActiveModal, private router: Router, private authenticationService: AuthenticationService) { }

  /**
   * @author Om kanada
   * @description
   * register now
   */

  public registerNow() {
    this.modalService.close(false);
    // Logout that user.
    this.authenticationService.logout().then((success) => {
      // on success of logout redirect to registration.
      this.router.navigate(['registration']);
    }, (error) => {
      this.router.navigate(['login']);
    });
  }

  /**
   * @author Om kanada
   * @description
   * close dialog
   */
  public close() {
    // get current location path
    this.currentPath = this.router.url;
    if (this.content.urls) {
      this.content.urls.filter(contentData => {
        if (contentData === this.currentPath) {
          this.router.navigate(['home']);
        }
      });
    }
    this.modalService.close(false);
  }

  ngOnInit() {
    this.content = this.data.content; // To load contentData on init
  }

}
