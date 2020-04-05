import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@app/shared/services';

@Component({
  selector: 'app-invite-clients-mail-detail',
  templateUrl: './invite-clients-mail-detail.component.html',
  styleUrls: ['./invite-clients-mail-detail.component.scss']
})
export class InviteClientsMailDetailComponent implements OnInit {

  @Input() settings: any = {};
  public permission: any = {};

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.permission = {
      canSaveClientSettings: this.userService.can('CAN_SAVE_CLIENT_SETTING')
    }
  }

}
