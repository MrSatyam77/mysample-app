import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackupReturnComponent } from '@app/return/components/backup-return/backup-return.component';
@Component({
  selector: 'app-return-back-restore',
  templateUrl: './return-backup-restore.component.html',
  styleUrls: ['./return-backup-restore.component.scss']
})
export class ReturnBackupRestoreComponent implements OnInit {
  public refreshStart: boolean;
  public option = 'backup';
  private routeSubscription: Subscription;

  @ViewChild('backupreturn', { static: false }) backupreturn: BackupReturnComponent;
  constructor(private router: Router, private _activatedRoute: ActivatedRoute) { }

/**
   * @author Satyam Jasoliya
   * grid refesh 
   * @memberof ReturnBackupRestoreComponent
   */
  manuallyRefresh() {
    this.refreshStart = true;
    this.backupreturn.getList().then((response: any) => {
      this.refreshStart = false;
    }, error => {
      this.refreshStart = false;
    });
  }

  /**
   * @author Ravi Shah
   * Go to Home
   * @memberof ReturnBackupRestoreComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  ngOnInit() {
    this.routeSubscription = this._activatedRoute.paramMap.subscribe((params: any) => {
      if (params.params.key === 'restore') {
        this.option = 'restore';
      } else {
        this.option = 'backup';
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
