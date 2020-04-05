// External Imports
import { Injectable } from '@angular/core';

// Internal Imports

import { APINAME } from '@app/shared/shared.constants';
import { environment } from "@environments/environment"
import { CommonAPIService } from './common-api.service';
import { UserService } from './user.service';
import { LocalStorageUtilityService } from './local-storage-utility.service';

declare var firebase: any;
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Instance of the Firebase & Token
  public messaging;
  public fcmToken;
  public _isFirebaseTokenStored = false;
  public _isDoItLaterClicked = false;
  public _notificationStatus = '';
  public _notificationSupported = false;

  constructor(private _commonApiService: CommonAPIService, private _userService: UserService, private _localStorageUtilityService: LocalStorageUtilityService) { }

  // CONFIGURE FIREBASE
  public firebaseConfiguration() {

    return new Promise((resolve, reject) => {
      this._notificationSupported = firebase.messaging.isSupported();
      if (this._notificationSupported) {

        // CONFIGURING THE FIREBASE FCM Settings
        firebase.initializeApp(environment.firebase);
        this.messaging = firebase.messaging();
        this.messaging.getToken().then((token) => {
          if (token) {
            this._localStorageUtilityService.addToLocalStorage('n_token', token);
            this._notificationStatus = 'granted';
            this._isFirebaseTokenStored = true;
            this.requestNotificationPermission().then(()=>{
              resolve(true);
            });
          } else {
            // SHOW DIALOG
            this._notificationStatus = '';
            this._isFirebaseTokenStored = false;
            resolve(true);
          }
        }, (error) => {
          this._notificationStatus = 'blocked';
          const userDetails = this._userService.getUserDetails();
          const storedToken = this._localStorageUtilityService.getFromLocalStorage('n_token');
          if (userDetails && (!userDetails.notification || !userDetails.notification.devices ||
            userDetails.notification.devices.length === 0)) {
            this.updateToken({ permission: 'blocked' }).then((res) => { });
          } else if (userDetails.notification && userDetails.notification.devices && userDetails.notification.devices.length > 0) {
            if (storedToken) {
              // const isExists = _.findIndex(userDetails.notification.devices, { token: storedToken });
              const isExists = userDetails.notification.devices.findIndex(t => t.token === storedToken);
              if (isExists > -1 && userDetails.notification.devices[isExists].permission !== 'blocked') {
                this.updateToken({ permission: 'blocked', token: storedToken }).then((res) => { });
              } else {
                const isExists = userDetails.notification.devices.findIndex(t => t.permission === 'blocked');
                if (isExists === -1) {
                  this.updateToken({ permission: 'blocked' }).then((res) => { });
                }
              }
            } else {
              const isExists = userDetails.notification.devices.findIndex(t => t.permission === 'blocked');
              if (isExists === -1) {
                this.updateToken({ permission: 'blocked' }).then((res) => { });
              }
            }

          }
          console.error(error);
          resolve(true);
        });

        // EVENT WHICH WATCH THE MESSAGE RECIEVED IN FOREGROUND
        this.listenMessageToForegroundEvent();
      } else {
        resolve(true);
      }
      // return deferred.promise;
    });
  }

  public requestNotificationPermission() {
    return new Promise((resolve, reject) => {
      this.checkPermissionAndGenerateToken().then((response: any) => {
        const userDetails = this._userService.getUserDetails();
        if (userDetails.notification && userDetails.notification.devices &&
          userDetails.notification.devices.length > 0 && response.token) {
          const isExists = userDetails.notification.devices.findIndex(t => t.token === response.token);
          if (isExists === -1) {
            // CALL API TO SAVE TOKEN IF CHANGES
            this.updateToken(response).then((notificationResult) => {
              userDetails.notification = notificationResult;
            });
          }
        } else if (response.token) {
          // CALL API TO SAVE TOKEN
          this.updateToken(response).then((notificationResult) => {
            userDetails.notification = notificationResult;
          });
        } else if (response.permission === 'blocked') {
          // CALL API TO SAVE TOKEN
          this.updateToken(response).then((notificationResult) => {
            userDetails.notification = notificationResult;
          });
        }
        resolve(true);
      });
      // return deferred.promise;
    });
  }

  public checkPermissionAndGenerateToken() {
    // return deferred.promise;
    return new Promise((resolve, reject) => {
      // REQUEST FOR THE PERMISSION
      this.messaging.requestPermission().then(() => {
        // CALL THE API WHICH SET THE NOTIFICATION IS NOT ALLOWED
        // console.log("FIREBASE : Notification permission granted.");
        // get the token in the form of promise
        this._isFirebaseTokenStored = true;
        return this.messaging.getToken();
      }).then((token) => {
        // CALL THE API WHICH SET THE FIREBASE TOKEN
        this.fcmToken = token;
        // console.log("FIREBASE : Token is : " + token);
        this._notificationStatus = 'granted';
        resolve({ permission: 'granted', token: token });
      }).catch((err) => {
        // CALL THE API WHICH SET THE NOTIFICATION IS NOT ALLOWED
        this._isFirebaseTokenStored = false;
        console.error('FIREBASE : Unable to get permission to notify.', err);
        this._notificationStatus = 'blocked';
        resolve({ permission: 'blocked', token: this.fcmToken });
      });
    });
  }
  // EVENT WHICH WATCH THE MESSAGE RECIEVED IN FOREGROUND
  public listenMessageToForegroundEvent() {
    // EVENT WHICH WATCH THE MESSAGE RECIEVED IN FOREGROUND
    this.messaging.onMessage((payload: any) => {
      // console.log("FIREBASE : Message received. ", payload);
      const notify = JSON.parse(payload.data.notification);
      notify.data = notify;
      const notification = new Notification(notify.title, notify);
      notification.onclick = (e: any) => {
        // tslint:disable-next-line:no-shadowed-variable
        const notification = e.target;
        const extraData = e.target.data;
        const action = e.action;
        if (action === 'close') {
          notification.close();
        } else {
          window.location.href = extraData.click_action;
          window.focus();
          notification.close();
        }
      };
    });
  }

  public updateToken(data) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonApiService.getPromiseResponse({
        apiName: APINAME.NOTIFICATION_TOKEN_UPDATE,
        parameterObject: data
      }).then(response => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  }

  public doItLater() {
    const self = this;
    return new Promise((resolve, reject) => {

      self._commonApiService.getPromiseResponse({
        apiName: APINAME.NOTIFICATION_DOITLATER,
        parameterObject: {}
      }).then(response => {
        resolve(true);
      }, error => {
        reject(error);
      });
    });
  }

  public showNotificationAlert() {
    return this._isFirebaseTokenStored && !this._isDoItLaterClicked;
  }

  public isTokenExists() {
    return this._isFirebaseTokenStored;
  }

  public getNotificationStatus() {
    return this._notificationStatus;
  }

  public isSupported() {
    return this._notificationSupported;
  }

}
