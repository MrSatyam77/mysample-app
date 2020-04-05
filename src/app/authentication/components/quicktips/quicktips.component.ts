// External Imports
import { Component, OnInit } from '@angular/core';


// Internal Imports
import { AuthenticationService } from '@app/authentication/authentication.service';

@Component({
  selector: 'app-quicktips',
  templateUrl: './quicktips.component.html',
  styleUrls: ['./quicktips.component.scss']
})
export class QuicktipsComponent implements OnInit {

  // hold response of quick Tips
  public QuikTipsResponse: any;

  constructor(private authService: AuthenticationService) { }

 /**
  * @author Mansi Makwana
  * @description
  * Method is use to get Quick Tips data
  */
  public getQuikTips() {
    this.authService.getQuickTipsData().then((response: any) => {
      this.QuikTipsResponse = response;
    });
  }

  ngOnInit() {
    this.getQuikTips();
  }

}
