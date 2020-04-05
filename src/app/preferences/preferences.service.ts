import { Injectable } from '@angular/core';
import { CommonAPIService, UserService, SystemConfigService, CommunicationService } from '@app/shared/services';
import { APINAME } from './preferences.constants';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  public roles: any = { customer: 0, office: 1, user: 2 }
  public isLookupLoaded = {
    priceList: false,
    preparerList: false,
    clientOrganizerList: false,
    clientLetterList: false,
    officeList: false
  }
  public lookup: any = {
    autoAddState: [{
      id: 1,
      name: 'Auto-add state return based on the Client Information Sheet'
    }, {
      id: 2,
      name: 'Auto-add state return based on the W2'
    }, {
      id: 3,
      name: 'Auto-add state return based on the Client Information Sheet and the W2'
    }, {
      id: 4,
      name: 'Do not auto-add state return '
    }],
    yesNoLookup: [
      { id: true, name: 'Yes' },
      { id: false, name: 'No' }
    ],
    themeLookup: [
      { id: 'classic', name: 'Classic' },
      { id: 'modern', name: 'Modern' }
    ],
    menu: [
      { id: "mtpo", name: 'myTAXprepoffice' },
      { id: "taxWise", name: 'TaxWise' },
      { id: "atx", name: 'ATX' },
      { id: "proSeries", name: 'ProSeries' },
      { id: "drake", name: 'DrakeSoftware' },
      { id: "crossLink", name: 'Crosslink' }
    ]
  };

  public readonly defaultPreferences: any = {
    returnWorkspace: {
      defaultPreparer: {
        "rightModel": this.roles.user,
        "value": ''
      },
      "priceList": {
        "rightModel": this.roles.customer,
        "value": ''
      },
      "autoSaveEIN": {
        "rightModel": this.roles.customer,
        "value": true
      },
      "passwordProtectedReturn": {
        "rightModel": this.roles.user,
        "value": false
      },
      "passwordType": {
        "rightModel": this.roles.user,
        "value": false
      },
      "wrapText": {
        "rightModel": this.roles.user,
        "value": false
      },
      "doNotAskforConfirmDlg": {
        "rightModel": this.roles.user,
        "value": false
      },
      "autoAddState": {
        "rightModel": this.roles.user,
        "value": {}
      },
      "autoSaveOccupation": {
        "rightModel": this.roles.user,
        "value": false
      },
      "clientLetter": {
        "rightModel": this.roles.user,
        "value": ''
      },
      "eFileTransmissionDialogue": {
        "rightModel": this.roles.user,
        "value": false
      },
      "printPacket": {
        "rightModel": this.roles.customer,
        "value": ''
      },
      "returnStatus": {
        "rightModel": this.roles.user,
        "value": false
      },
    },
    clientOrganizer: {},
    color: {
      reject: {
        "rightModel": this.roles.user,
        "value": '#a94442'
      },
      warning: {
        "rightModel": this.roles.user,
        "value": '#8a6d3b'
      },
      info: {
        "rightModel": this.roles.user,
        "value": '#3c763d'
      },
      normal: {
        "rightModel": this.roles.user,
        "value": '#000000',
        "settings": 'border'
      },
      required: {
        "rightModel": this.roles.user,
        "value": '#ff0000',
        "settings": 'border'
      },
      calculated: {
        "rightModel": this.roles.user,
        "value": '#ffd800',
        "settings": 'border'
      },
      overriden: {
        "rightModel": this.roles.user,
        "value": '#c0c0c0',
        "settings": 'border'
      },
      estimated: {
        "rightModel": this.roles.user,
        "value": '#3c763d',
        "settings": 'border'
      }
    },
    miscellaneous: {
      dashboardSettings: {
        "rightModel": this.roles.user,
        "value": ''
      }
    },
    themePreferences: {
      theme: {
        "rightModel": this.roles.user,
        "value": 'classic'
      },
      menu: {
        "rightModel": this.roles.customer,
        "value": 'mtpo'
      }
    }
  }

  public defaultColor: any = {}

  constructor(private communicationService: CommunicationService, private commonAPIService: CommonAPIService, private userService: UserService, private systemConfigService: SystemConfigService) { }

  /**
   * @author Ravi Shah
   * Get Preferences 
   * @returns
   * @memberof PreferencesService
   */
  public getPreferences(userId?: any) {
    return new Promise((resolve, reject) => {
      if (!userId) {
        userId = this.userService.getUserDetails().key;
      }
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.PREFERENCE_GET, parameterObject: { userId } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      })
    });
  }

  /**
   * @author Ravi Shah
   * Save the Preferences Details
   * @param {*} preferencesDetails
   * @returns
   * @memberof PreferencesService
   */
  public savePreferences(preferencesDetails: any, userId?: any) {
    return new Promise((resolve, reject) => {

      for (let preference in preferencesDetails) {
        if (preference !== 'userId') {
          for (let key in preferencesDetails[preference]) {
            if (preferencesDetails[preference].rightModel === this.roles.office) {
              delete preferencesDetails[preference].value;
              preferencesDetails[preference].locations = preferencesDetails[preference].locations ? preferencesDetails[preference].locations : [];
            } else {
              delete preferencesDetails[preference].locations;
              preferencesDetails[preference].value = preferencesDetails[preference].value ? preferencesDetails[preference].value : undefined;
            }
          }
        }
      }
      preferencesDetails.userId = userId ? userId : this.userService.getUserDetails().key;
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.PREFERENCE_SAVE, parameterObject: preferencesDetails }).then((response) => {
        this.commonAPIService.getPromiseResponse({ apiName: APINAME.GET_PREFERENCES }).then((preferences) => {
          this.userService.updateUserPreferences(preferences.data);
          resolve(response.data);
        });
      }, (error) => {
        reject(error);
      })
    });
  }

  /**
   * @author Ravi Shah
   * Get All The lookup for the Preference Screen
   * @returns
   * @memberof PreferencesService
   */
  public getAllLookup() {
    return new Promise((resolve, reject) => {
      this.isLookupLoaded = { priceList: false, preparerList: false, clientOrganizerList: false, clientLetterList: false, officeList: false }
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.PRICE_LIST, parameterObject: {} }).then((priceList) => {
        this.lookup.priceList = priceList.data;
        this.lookup.priceList.unshift({ id: '', name: 'None' });
        this.isLookupLoaded.priceList = true;
        if (this.isLookupLoaded.priceList && this.isLookupLoaded.preparerList && this.isLookupLoaded.clientOrganizerList && this.isLookupLoaded.clientLetterList && this.isLookupLoaded.officeList) {
          resolve(this.lookup);
        }
      });
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.PREPARER_LIST, parameterObject: {} }).then((preparerList) => {
        this.lookup.preparerList = [];
        preparerList.data.preparerList.forEach(element => {
          this.lookup.preparerList.push({ id: element.preparer.preparerId, name: element.preparer.preparerName });
        });
        this.lookup.preparerList.unshift({ id: '', name: 'None' });
        this.isLookupLoaded.preparerList = true;
        if (this.isLookupLoaded.priceList && this.isLookupLoaded.preparerList && this.isLookupLoaded.clientOrganizerList && this.isLookupLoaded.clientLetterList && this.isLookupLoaded.officeList) {
          resolve(this.lookup);
        }
      });
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.CLIENTORGANIZER_LIST, parameterObject: {} }).then((clientOrganizerList) => {
        this.lookup.packages = this.systemConfigService.getReleasedPackages();
        this.lookup.clientOrganizerList = {};
        for (let packages of this.lookup.packages) {
          this.lookup.clientOrganizerList[packages.id] = clientOrganizerList.data.filter(t => t.returnType === packages.id) || [];
          this.lookup.clientOrganizerList[packages.id].unshift({ id: '', name: 'None' });
        }
        this.isLookupLoaded.clientOrganizerList = true;
        if (this.isLookupLoaded.priceList && this.isLookupLoaded.preparerList && this.isLookupLoaded.clientOrganizerList && this.isLookupLoaded.clientLetterList && this.isLookupLoaded.officeList) {
          resolve(this.lookup);
        }
      });
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.CLIENTLETTER_LIST, parameterObject: {} }).then((clientLetterList) => {
        this.lookup.clientLetterList = clientLetterList.data;
        this.lookup.clientLetterList.unshift({ id: '', name: 'None' });
        this.isLookupLoaded.clientLetterList = true;
        if (this.isLookupLoaded.priceList && this.isLookupLoaded.preparerList && this.isLookupLoaded.clientOrganizerList && this.isLookupLoaded.clientLetterList && this.isLookupLoaded.officeList) {
          resolve(this.lookup);
        }
      });

      this.commonAPIService.getPromiseResponse({ apiName: '/location/list', parameterObject: { location: true } }).then((officeList) => {
        this.lookup.officeList = officeList.data;
        this.isLookupLoaded.officeList = true;
        if (this.isLookupLoaded.priceList && this.isLookupLoaded.preparerList && this.isLookupLoaded.clientOrganizerList && this.isLookupLoaded.clientLetterList && this.isLookupLoaded.officeList) {
          resolve(this.lookup);
        }
      }, (error) => {
        reject(error);
      })
    });
  }


  public applyMenuChanges(previousSoftware) {
    return new Promise((resolve, reject) => {
      resolve(true);
      return new Promise((resolve, reject) => {
        this.commonAPIService.getPromiseResponse({
          apiName: '/software/getSideMenuConfiguration',
          parameterObject: { 'previousSoftware': previousSoftware }
        }).then((response) => {
          this.userService.updateSidebarDetails(response.data);
          this.communicationService.transmitData({
            channel: 'MTPO-MENU-CHANGE',
            topic: 'updateSidebar',
            data: response.data
          });
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
      })
    });
  }


  public colorDefaults() {
    return new Promise((resolve, reject) => {
      this.commonAPIService.getPromiseResponse({ apiName: '/preference/color/defaults', parameterObject: {} }).then((colorDefaults) => {
        this.defaultColor = JSON.parse(JSON.stringify(colorDefaults.data));
        resolve(colorDefaults.data);
      }, (error) => {
      })
    });
  }

  public applyThemeChanges() {
    return new Promise((resolve, reject) => {
      const self = this;
      self.userService.updateUserStyle(true).then(() => {
        resolve(true);
      }, function (error) {
        reject(error);
      });
    });
  }
}
