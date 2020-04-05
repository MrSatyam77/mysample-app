import { Injectable } from '@angular/core';
import * as Raven from 'raven-js';

// Imports
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

/**
 * Sentry Service which stores error message in raven
 */
@Injectable({
  providedIn: 'root'
})
export class SentryService {

  constructor(private userService: UserService) { }

  moveErrorToSentry(error: any) {
    if (environment.mode == 'local') {
      console.error(error);
      // throw error;
    } else {
      let userDetails = this.userService.getUserDetails();
      let errorMessage = {
        userId: userDetails ? userDetails.key : undefined,
        locationId: this.userService.getLocationId(false),
        taxYear: this.userService.getTaxYear(),
        errMsg: error
      }
      if (userDetails && Object.keys(userDetails).length > 0) {
        errorMessage = {
          userId: userDetails ? userDetails.key : undefined,
          locationId: this.userService.getLocationId(false),
          taxYear: this.userService.getTaxYear(),
          errMsg: error
        }
      }
      Raven.captureException(JSON.stringify(errorMessage), {
        level: 'error' // one of 'info', 'warning', or 'error'
      });
    }
  }
}
