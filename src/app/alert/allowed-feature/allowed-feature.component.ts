import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/shared/services';


@Component({
  selector: 'app-allowed-feature',
  templateUrl: './allowed-feature.component.html',
  styleUrls: ['./allowed-feature.component.scss']
})
export class AllowedFeatureComponent implements OnInit {

  constructor(private router:Router, private _userService:UserService) { }

  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    if(this._userService.getTaxYear() != '2019'){
      this.router.navigate(['/home']);
    }
  }

}
