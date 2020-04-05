// External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { environment } from '@environments/environment';
import { CommonAPIService, UserService } from '@app/shared/services';
import { APINAME } from '@app/shared/shared.constants';

@Component({
  selector: 'app-new-feature-update',
  templateUrl: './new-feature-update.component.html',
  styleUrls: ['./new-feature-update.component.scss']
})

export class NewFeatureUpdateComponent implements OnInit {
  public static_url = environment.static_url;
  constructor(private _ngbActiveModal:NgbActiveModal , private _commonAPIService:CommonAPIService, private _userService:UserService) { }

  ngOnInit() {
  }

  /**
   * close the dialog
   */
  close(){
    this._ngbActiveModal.close();
  }


  /**
   * call api to update flag and close dioalog
   */
  ok(){
    const self = this;
    this._commonAPIService.getPromiseResponse({ apiName: APINAME.UPDATE_NEW_FEATURE_FLAG }).
      then(response => {
        //set flag in user service for new feature update
        self._userService.setNewFeatureFlag(true);
        self._ngbActiveModal.close(true);
      }, error => {
        console.error(error);
        self._ngbActiveModal.close(true);
      });
  }
}
