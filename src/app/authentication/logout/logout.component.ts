// External Imports
import { Component, OnInit } from '@angular/core';

// Internal Imports
import { AuthenticationService } from '@app/authentication/authentication.service';
import { MessageService, MediaService, LocalStorageUtilityService } from '@app/shared/services/index';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private _authService: AuthenticationService,
    private _messageService: MessageService,
    private _mediaService: MediaService,
    private _localStorageUtilityService: LocalStorageUtilityService) { }

  /**
   * @author Heena Bhesaniya
   * @description call media api and logout api and reload the application
   */
  ngOnInit() {
    //For Media API
    this._mediaService.callView('logout', '', '', '');
    //Call logout api
    this._authService.logout().then((success) => {
      // Issue :- manually bootstrap IF possible.
      this._messageService.showMessage('Logged Out Successfully', 'success', 'HEADERNAVCON_LOGOUTSUCCESS_MSG');
      this._localStorageUtilityService.removeFromLocalStorage("instantFormViewDeviceId");
      this._localStorageUtilityService.removeFromLocalStorage('returnPreview')
      window.location.reload(true);
    })
  }
}
