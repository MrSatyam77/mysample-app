import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  public option: any = 'trusted-device';

  constructor(private router: Router) { }


   public changeTab(tabName) {
    this.option = tabName;
   }
  
 /**
  * @author Mansi Makwana
  * To Redirect Home Screen
  * @memberOf PreferencesComponent
  */
backToHomeScreen() {
  this.router.navigateByUrl('/home');
  }
  ngOnInit() {
  }

}
