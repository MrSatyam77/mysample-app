// External Imports
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Internal Imports
import { officeDetail } from '@app/office/office';
import { UserService, ResellerService, DialogService, MessageService } from '@app/shared/services';
import { OfficeService } from '@app/office/office.service';

@Component({
  selector: 'app-office-detail',
  templateUrl: './office-detail.component.html',
  styleUrls: ['./office-detail.component.scss']
})
export class OfficeDetailComponent implements OnInit, OnChanges {

  // holds detail obj for office
  @Input() officeDetail: officeDetail;

  // output event for edit office event
  @Output() edit = new EventEmitter<string>();

  // output event for refresh location list in case of change in data
  @Output() refreshOfficeList = new EventEmitter<boolean>();

  public userCan: any = {};
  public hasFeature: any = {};
  public currentLocationId: string = "";

  constructor(
    private _userService: UserService,
    private _resellerService: ResellerService,
    private _officeService: OfficeService,
    private _dialogService: DialogService,
    private _messageService: MessageService) { }

  // to show edit screen for this office
  editOffice() {
    this.edit.emit(this.officeDetail.key);
  }

  // to call api to delete selected office
  removeOffice() {
    const self = this;
    const dialogConfig = { 'keyboard': false, 'backdrop': 'static', 'size': 'sm' };
    const dialogData = { title: "Confirmation", text: "Do you want to delete this location?" }
    self._dialogService.confirm(dialogData, dialogConfig).result.then((result) => {
      self._officeService.removeLocation([self.officeDetail.key]).then((response) => {
        self._messageService.showMessage("Office removed successfully", "success");
        self.refreshOfficeList.emit(true);
      })
    })
  }

  // to get roles and restriction flags to allow/disallow feature,
  private getRolesAndRestrictionFlags() {
    this.userCan = {
      removeOffice: this._userService.can('CAN_REMOVE_LOCATION'),
      openOffice: this._userService.can('CAN_OPEN_LOCATION'),
      saveOffice: this._userService.can('CAN_SAVE_LOCATION')
    }
    this.hasFeature = {
      deleteOffice: this._resellerService.hasFeature('DELETELOCATION')
    }
  }

  ngOnChanges() {
    this.getRolesAndRestrictionFlags();
  }

  ngOnInit() {
    this.currentLocationId = this._userService.getValue("currentLocationId");
  }

}
