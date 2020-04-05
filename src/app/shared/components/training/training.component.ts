// External imports
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// Internal imports
import { environment } from '@environments/environment';
import { CommunicationService } from '../../services/communication.service';
import { TrainingService } from './training.service';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  @Input() trainingDataLength: number;
  @Output() trainingDataLengthChange = new EventEmitter();
  public searchText: any = '';
  private currentPath; // to get current route path
  public trainingDataList: any = []; // to store api response data
  private currentForm = {}; //  to hold current form name
  private currentField = '';  // to hold current field name required for refresh call
  private selectedSofwareName: any; // hold software name
  private params: any; // to hold routing parameter
  private paramsSubscription: Subscription; // to hold params subscription
  private ConversionscreenLoadedWithSofwareName: Subscription; // to hold subscription response
  private formLoadedWithForm: Subscription; // to hold formloaded subscription
  private fieldFocusListner: Subscription; // to hold fieldfocus listner
  private routerListner: Subscription; // to hold router changes
  constructor(private communicationService: CommunicationService, private route: ActivatedRoute, private location: Location, private trainingService: TrainingService, private router: Router) { }

  /**
   * @author Om kanada
   * @description
   * communication service watcher on init to get transmittedData.
   */
  private commmunicationServiceWatcher(): void {
    if (this.currentPath === '/return/edit') {
      this.formLoadedWithForm = this.communicationService.transmitter.subscribe((data: any) => {
        if (data.topic === 'formLoadedWithForm') { }
        this.currentForm = data.form.formName;
        // api call to getting training info base on module,mode and form name
        this.trainingService.getTrainingData('return', 'edit', this.currentForm, '', false, undefined).then((success) => {
          this.trainingDataList = success;
          this.sendLengthOfResponseToParent(this.trainingDataList.length);
        }, (error) => {
          this.sendLengthOfResponseToParent(0);
        });
      });
      this.fieldFocusListner = this.communicationService.transmitter.subscribe((data: any) => {
        if (data.topic === 'fieldFocus') {
          this.currentField = data.elementId;
          setTimeout(() => {
            this.trainingService.getTrainingData('return', 'edit', this.currentForm, data.elementId, false, undefined).then((success) => {
              this.trainingDataList = success;
              this.sendLengthOfResponseToParent(this.trainingDataList.length);
            }, (error) => {
              // $log.error(error);
              this.sendLengthOfResponseToParent(0);
            });
          }, 2000);
        }
      });
    } else if (this.currentPath === '/conversion/new' || this.currentPath == '/conversionnew/new') {
      let softwareNameForConversion;
      this.ConversionscreenLoadedWithSofwareName = this.communicationService.transmitter.subscribe((data: any) => {
        if (data.topic === 'ConversionSoftwareName') {
          if (data.data.value) {
            softwareNameForConversion = data.data.name;
          }
          // api call to getting training info base on module,mode and form name
          this.trainingService.getTrainingData('conversion', 'new', '', '', false, softwareNameForConversion).then((success) => {
            this.trainingDataList = success;
            this.sendLengthOfResponseToParent(this.trainingDataList.length);
          }, (error) => {
            this.sendLengthOfResponseToParent(0);
          });
        }
      });
      if (this.ConversionscreenLoadedWithSofwareName) {
        // tslint:disable-next-line:max-line-length
        this.trainingService.getTrainingData('conversion', 'new', '', '', false, this.selectedSofwareName ? this.selectedSofwareName.name : undefined).then((success) => {
          this.trainingDataList = success;
          this.sendLengthOfResponseToParent(this.trainingDataList.length);
        }, (error) => {
          this.sendLengthOfResponseToParent(0);
        });
      }
    } else {
      const curSplitPath = this.currentPath.split('/');
      let moduleName = curSplitPath[curSplitPath.length - 2];
      let mode = curSplitPath[curSplitPath.length - 1];
      // If there is no module, make mode as module and mode blank
      if (moduleName === '' && mode !== '') {
        moduleName = mode;
        mode = '';
      }
      this.trainingService.getTrainingData(moduleName, mode, '', '', false, undefined).then((success) => {
        this.trainingDataList = success;
        this.sendLengthOfResponseToParent(this.trainingDataList.length);
      }, (error) => {
        this.sendLengthOfResponseToParent(0);
      });
    }
  }

  /**
   * @author Om kanada
   * @description
   * function is use to refresh manually api data.
   */
  public manuallyRefreshTraining() {
    return new Promise((resolve, reject) => {
      if (this.currentPath === '/return/edit') {
        this.trainingService.getTrainingData('return', 'edit', this.currentForm, this.currentField, true, '').then((success) => {
          // this.firstRefreshStart = false;sendLengthOfResponseToParent()
          this.trainingDataList = success;
          this.sendLengthOfResponseToParent(this.trainingDataList.length);
          resolve(success);
        }, (error) => {
          this.sendLengthOfResponseToParent(0);
          reject(error);
        });
      } else if (this.currentPath === '/conversion/new') {
        this.trainingService.getTrainingData('conversion', 'new', '', '', true, this.selectedSofwareName.name).then((success) => {
          this.trainingDataList = success;
          this.sendLengthOfResponseToParent(this.trainingDataList.length);
          resolve(success);
        }, (error) => {
          this.sendLengthOfResponseToParent(0);
          reject(error);
        });
      } else {
        const curSplitPath = this.currentPath.split('/');
        let moduleName = curSplitPath[curSplitPath.length - 2];
        let mode = curSplitPath[curSplitPath.length - 1];
        // If there is no module, make mode as module and mode blank
        if (moduleName === '' && mode !== '') {
          moduleName = mode;
          mode = '';
        }
        this.trainingService.getTrainingData(moduleName, mode, '', '', true, undefined).then((success) => {
          this.trainingDataList = success;
          resolve(success);
          this.sendLengthOfResponseToParent(this.trainingDataList.length);
        }, (error) => {
          this.sendLengthOfResponseToParent(0);
          reject(error);
        });
      }
    });
  }
  /**
   * @author Om kanada
   * @description
   * function is used to check whether application run on beta & local or live .
   */
  private betaOnly(): boolean {
    if (environment.mode === 'beta' || environment.mode === 'local') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @author Om kanada
   * @description
   * function is used to send training data length to parent.
   */
  public sendLengthOfResponseToParent(length: number): void {
    this.trainingDataLengthChange.emit(length);
  }

  clearSearch() {
    this.searchText = '';
  }

  /**
   * @author Om kanada
   * @description
   * function is to destroy subscription .
   */
  ngOnDestroy(): void {
    if (this.ConversionscreenLoadedWithSofwareName) {
      this.ConversionscreenLoadedWithSofwareName.unsubscribe();
    }
    if (this.formLoadedWithForm) {
      this.formLoadedWithForm.unsubscribe();
    }
    if (this.fieldFocusListner) {
      this.fieldFocusListner.unsubscribe();
    }
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.routerListner) {
      this.routerListner.unsubscribe();
    }
  }
  initTraining() {
    // To get currentpath
    this.currentPath = this.location.path();
    // To get url parameter(like id ..)
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      this.params = params;
    });
    if (this.params.params) {
      for (const key in this.params.params) {
        if (key) {
          if (this.params.hasOwnProperty(key)) {
            this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/' + this.params[0]));
          }
        }
      }
    }
    // call communicationServiceWatcher function
    this.commmunicationServiceWatcher();
  }
  /**
   * @author Om kanada
   * @description
   * onInit.
   */
  ngOnInit() {
    this.initTraining();
    this.routerListner = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.initTraining();
      }
    });
  }

}
