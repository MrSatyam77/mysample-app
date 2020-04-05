import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EfileComponent } from '@app/efile-center/components/efile/efile.component';
import { BankEfileCenterComponent } from '@app/efile-center/components/bank-efile-center/bank-efile-center.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-efile-bank',
  templateUrl: './efile-bank.component.html',
  styleUrls: ['./efile-bank.component.scss']
})
export class EfileBankComponent implements OnInit {

  public option = 'eFile';
  public refreshStart: boolean = false;
  private routeSubscription: Subscription;

  @ViewChild('eFileCenter', { static: false }) eFileCenterComponent: EfileComponent;
  @ViewChild('eFileBankCenter', { static: false }) bankEfileCenter: BankEfileCenterComponent;

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) { }

  /**
   * @author Ravi Shah
   * Go to Home
   * @memberof EfileBankComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  public refreshEfileCenter() {
    this.refreshStart = true;
    if (this.option === 'eFile') {
      this.eFileCenterComponent.getList(true).then((response: any) => {
        this.refreshStart = false;
      }, error => {
        this.refreshStart = false;
      });
    } else if (this.option === 'bank') {
      this.bankEfileCenter.getList().then((response: any) => {
        this.refreshStart = false;
      }, error => {
        this.refreshStart = false;
      });
    } else {
      this.refreshStart = false;
    }

  }
  ngOnInit() {
    this.routeSubscription = this._activatedRoute.paramMap.subscribe((params: any) => {
      if (params.params.option === 'bank') {
        this.option = 'bank';
      } else {
        this.option = 'eFile';
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
