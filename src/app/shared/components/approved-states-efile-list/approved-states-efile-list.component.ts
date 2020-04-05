// Internal Imports
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

// External Imports
import { SystemConfigService, ConfigService } from '@app/shared/services/index';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-approved-states-efile-list',
  templateUrl: './approved-states-efile-list.component.html',
  styleUrls: ['./approved-states-efile-list.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class ApprovedStatesEfileListComponent implements OnInit {

  public packageNameList: any = [];
  public stateWisePackageList = []; // hold final list with state and package details
  public packageListForFederal = []; // add federal on first position
  public releasedPackagesList: any = [];
  public pkgList: any;
  public configData: any;  // get config data  using year wise
  public stateList: any;  // get current year state list
  public federalList: any;   // get current year federal list
  public taxYear: any;
  public commonStates: any = [];
  public packageList = [];
  public mode : boolean;


  constructor(private systemConfigService: SystemConfigService, private configService: ConfigService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }


  /**
   * @author Mansi Makwana
   *  @description
   * To Redirect Home Screen
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }
  /**
   * @author Mansi Makwana
   * @description
   * This method is used to prepare final list
   */
  public prepareFinalList() {
    let currentIndex;
    // get all common states
    this.commonStates = this.configData.commonStates.sort((obj1, obj2) => {
      if (obj1 < obj2) {
        return -1;
      }
      if (obj1 > obj2) {
        return 1;
      }
      return 0;
    });

    // preapare final list with state and package list
    this.stateWisePackageList = [];
    this.commonStates.forEach(state => {
      this.packageList = [];
      this.packageNameList.forEach(packageName => {
        if (this.releasedPackagesList.includes(packageName.packageName)) {
          if (this.stateList[packageName.packageName]) {
            currentIndex = this.stateList[packageName.packageName].findIndex((prefObj) => {
              return (prefObj.name !== undefined && state !== undefined && prefObj.name.toUpperCase() === state.toUpperCase());
            });
          }
          // package contain state or not
          if (currentIndex !== -1) {
            if (this.stateList[packageName.packageName][currentIndex].isReleased === true)
              this.packageList.push({ "isState": true, "estimatedDate": this.stateList[packageName.packageName][currentIndex].estimatedDate, "isReleased": this.stateList[packageName.packageName][currentIndex].isReleased, "eFileStatus": this.stateList[packageName.packageName][currentIndex].eFileStatus, "printingStatus": this.stateList[packageName.packageName][currentIndex].printingStatus, "printingReleaseDate": this.stateList[packageName.packageName][currentIndex].printingReleaseDate, "stateOnly": this.stateList[packageName.packageName][currentIndex].stateOnly, "packageName": packageName.packageName });
            else
              this.packageList.push({ "isState": false, "packageName": packageName.packageName });
          }
          else {
            this.packageList.push({ "isState": false, "packageName": packageName.packageName });
          }
        }
        else {
          this.packageList.push({ "isState": false, "packageName": packageName.packageName });
        }

      });
      this.stateWisePackageList.push({ "stateName": state, "packageList": this.packageList });
    });
    this.packageListForFederal = [];
    // add federal on first position
    this.packageNameList.forEach((packageName) => {
      if (this.releasedPackagesList.includes(packageName.packageName)) {
        this.packageListForFederal.push({ "isState": true, "isReleased": this.federalList[packageName.packageName].isReleased, "eFileStatus": this.federalList[packageName.packageName].eFileStatus, "estimatedDate": this.federalList[packageName.packageName].estimatedDate, "printingStatus": this.federalList[packageName.packageName].printingStatus, "printingReleaseDate": this.federalList[packageName.packageName].printingReleaseDate, "stateOnly": false, "packageName": packageName.packageName });
      } else
        this.packageListForFederal.push({ "isState": false, "packageName": packageName.packageName });
    });
    // Federal is not considered as state so we have to insert it manually
    this.stateWisePackageList.splice(0, 0, { "stateName": "Federal", "packageList": this.packageListForFederal });
    // end
  } 
 
  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
      if(location.pathname === '/eFile/approved/list'){
        this.mode = false;
      } else {
        this.mode = true;
      }
  });
    // getting current Tax year 
    this.taxYear = this.userService.getTaxYear();
    // get config data  using year wise
    this.configData = this.configService.getConfigData(this.taxYear, false);
    // get current year state list
    this.stateList = this.configData.stateList;
    // get current year federal list
    this.federalList = this.configData.federalList;
    // default release packages 
    this.packageNameList = [{ packageName: '1040', dateDisplayText: 'Estimated Date' },
    { packageName: '1065', dateDisplayText: 'Estimated Date' },
    { packageName: '1120', dateDisplayText: 'Estimated Date' },
    { packageName: '1120s', dateDisplayText: 'Estimated Date' },
    { packageName: '1041', dateDisplayText: 'Estimated Date' },
    { packageName: '990', dateDisplayText: 'Estimated Date' }];


    // prepare package name list (for now it's static )
    this.pkgList = this.systemConfigService.getReleasedPackages();
    this.releasedPackagesList = this.pkgList.map((t) => {
      return t.id;
    });
    this.prepareFinalList();
  }

}
