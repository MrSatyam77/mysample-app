// External Imporets
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Internal Imports
import { efinDetail } from '@app/office/office';
import { OfficeService } from '@app/office/office.service';
import { MessageService, DialogService } from '@app/shared/services';

@Component({
  selector: 'app-efin-detail',
  templateUrl: './efin-detail.component.html',
  styleUrls: ['./efin-detail.component.scss']
})
export class EfinDetailComponent implements OnInit, OnChanges {

  // holds efin detail object
  @Input() efinDetail: efinDetail = { displayedEROS: [], dispalyedLocations: [] };

  // edit event fro efin
  @Output() edit = new EventEmitter<string>();

  // close event 
  @Output() close = new EventEmitter<boolean>();

  // holds location data
  @Input() locationLookupData: any = [];

  // holds list of users
  @Input() userList: any = [];

  // holds logged in user detail
  @Input() loggedInUserDetail: any = {};

  constructor(
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _dialogService: DialogService) { }

  // event to show wdit section fro efin
  public editEFIN() {
    this.edit.emit(this.efinDetail.id);
  }

  // get name of location and ero based on ids comes from api to display in ui
  private prepareEROAndLocationDataToDisplay() {
    if (this.efinDetail.efinToUseInOffice && this.efinDetail.efinToUseInOffice.length > 0) {
      this.efinDetail.dispalyedLocations = this.locationLookupData.filter((element) => { return this.efinDetail.efinToUseInOffice.indexOf(element.locationId) >= 0 });
    }
    if (this.efinDetail.associatedUsers && this.efinDetail.associatedUsers.length > 0) {
      this.efinDetail.displayedEROS = this.userList.filter((element) => { return this.efinDetail.associatedUsers.indexOf(element.key) >= 0 });
    }
  }

  // this function is used to remove efin from list.
  public removeEFIN() {
    const self = this;
    let dialogConfig = { 'keyboard': false, 'backdrop': 'static', 'size': 'md' };
    self._dialogService.confirm({ title: "Confirmation", text: 'Are you sure you want to delete this EFIN?' }, dialogConfig)
    .result.then((result) => {
      self._officeService.removeEFIN(self.efinDetail.id, self.efinDetail.efin).then((response) => {
        self._messageService.showMessage("EFIN removed successfully.", "success");
        self.close.emit(true);
      })
    })
  }

  ngOnChanges() {
    this.prepareEROAndLocationDataToDisplay();
  }

  ngOnInit() {
  }

}
