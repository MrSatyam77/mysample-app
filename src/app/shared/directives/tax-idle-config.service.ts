//External imports
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxIdleConfigService {

  constructor() { }
  //hold tax idle idle time and warning time
  private taxIdleConfig: any = {
    idleTime: 15,
    warningTime: 2
  };

  //hold 24session intertime and warning time 
  private taxSession24Config: any = {
    intervalTime: 1,
    warningTime: 30
  };

  /**
   * @author Heena Bhesaniya
   * @description Set idle time in minutes
   * @param minutes 
   */
  public setIdleTimeForTaxIdle(minutes) {
    this.taxIdleConfig.idleTime = minutes;
  }

  /**
   * @author Heena Bhesaniya
   * @description Set warning time in minutes
   * @param minutes 
   */
  public setWarningTimeForTaxIdle(minutes) {
    this.taxIdleConfig.warningTime = minutes;
  }

  /**
   * @author Heena Bhesaniya
   * @description Return tax idle config copy
   */
  public getConfigForTaxIdle() {
    return JSON.parse(JSON.stringify(this.taxIdleConfig));
  }

  /**
  * @author Heena Bhesaniya
  * @description 
  * Set session time in minutes for tax session 24 hour
  * @param minutes 
  */
  public seIintervalTimeForTaxSession(minutes) {
    this.taxSession24Config.intervalTime = minutes;
  }

  /**
  * @author Heena Bhesaniya
  * @description 
  * Set warning time in minutes for tax seesion 24 hours
  * @param minutes 
  */
  public setWarningTimeForTaxSession(minutes) {
    this.taxSession24Config.warningTime = minutes;
  }

  /**
  * @author Heena Bhesaniya
  * @description Return 24Session object copy
  */
  public getConfigForTaxSession() {
    return JSON.parse(JSON.stringify(this.taxSession24Config));
  }
}
