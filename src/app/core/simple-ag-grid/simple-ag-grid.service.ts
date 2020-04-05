import { Injectable } from '@angular/core';

@Injectable()
export class SimpleAgGridService {

  private _propertyToOverride: any = {
    lockPosition: true,
    suppressMenu: true,
    hide: false
  }

  constructor() { }


  /**
   * @author Ravi Shah
   * Set of property will be overwrite the column Definition
   * @readonly
   * @type {string}
   * @memberof SimpleAgGridService
   */
  public get overrideProperty(): string {
    return this._propertyToOverride;
  }

  public renderCheckboxOnRow() {
    return (params) => {
      return params.columnApi.getRowGroupColumns().length === 0;
    }
  }

  public renderCheckboxOnHeader() {
    return (params) => {
      return params.columnApi.getRowGroupColumns().length === 0;
    }
  }
}
