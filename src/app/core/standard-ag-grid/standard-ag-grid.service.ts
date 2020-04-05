import { Injectable } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { CommonAPIService } from '@app/shared/services';

@Injectable()
export class StandardAgGridService {

  private _propertyToOverrideGridOptions: GridOptions = {
    suppressContextMenu: true,
    suppressColumnVirtualisation: true,
    suppressMaxRenderedRowRestriction: true,
    animateRows: true,
    suppressDragLeaveHidesColumns: true,
    suppressScrollOnNewData: true,
    suppressCopyRowsToClipboard: true,
    enableCellTextSelection: true,
    suppressRowClickSelection: true
  }

  private _propertyToOverrideColumnDefs: ColDef = {
    sortable: true,
    suppressMenu: true,
    hide: false,
    resizable: true,
    autoHeight: true
  }

  private defaultGridState: any = {};

  constructor(private commonAPIService: CommonAPIService) { }

  /**
   * @author Ravi Shah
   * Set of property will be overwrite the column Definition
   * @readonly
   * @type {string}
   * @memberof SimpleAgGridService
   */
  public overrideProperties(gridOptions: GridOptions): GridOptions {
    if (gridOptions) {
      for (let key in this._propertyToOverrideGridOptions) {
        gridOptions[key] = this._propertyToOverrideGridOptions[key];
      }
      gridOptions.defaultColDef = this._propertyToOverrideColumnDefs;
      gridOptions.rowSelection = gridOptions.rowSelection || 'single';
      gridOptions.columnDefs.forEach((obj: ColDef) => {
        if (obj.headerTooltip === undefined || obj.headerTooltip === null) {
          obj.headerTooltip = obj.headerName;
        }
        if (obj.tooltipField === undefined || obj.tooltipField === null) {
          obj.tooltipField = obj.field;
        }

        if (!obj.cellClass) {
          obj.cellClass = 'py-0 text-wrap'
        } else {
          obj.cellClass += ' py-0 text-wrap'
        }
      })
    }
    return gridOptions;
  }

  /**
   * @author Ravi Shah
   * Check the Length of the Object
   * @private
   * @param {*} obj
   * @returns
   * @memberof StandardAgGridService
   */
  private objectLength(obj) {
    //return Object.keys(obj).length;
    var i = 0;
    for (var prop in obj) {
      i++;
    }
    return i;
  }

  /**
   * @author Ravi Shah
   * Compare the Two Object
   * @param {*} obj1
   * @param {*} obj2
   * @returns
   * @memberof StandardAgGridService
   */
  public checkObjectEquals(obj1, obj2) {
    // If premitive or same instance of non-premitive
    if (obj1 === obj2) {
      return true;
    }
    //
    if (typeof obj1 == 'object' && typeof obj2 == 'object') {
      //Get number of properties in object
      let obj1Length = this.objectLength(obj1);
      let obj2Length = this.objectLength(obj2);
      //If both have no properties (empty objects) they are similar
      if (obj1Length == 0 && obj2Length == 0) {
        return true;
      } else if (obj1Length != obj2Length) {
        //If they do not match number properties then there is no need to check further
        return false;
      }

      //Holding result from loop
      let result = true;
      for (let prop in obj1) {
        //If we found false in last iteration just break it
        if (result == false) {
          break;
        }

        //Property must be own not from inheritance
        if (obj2.hasOwnProperty(prop) == true && obj1[prop] == obj2[prop]) {
          result = true;
        } else if (typeof obj1[prop] == 'object' && typeof obj2[prop] == 'object') {
          result = this.checkObjectEquals(obj1[prop], obj2[prop]);
        } else {
          result = false;
        }
      }

      //If the result of loop is true return ture
      if (result == true) {
        return true;
      }
    }
    //If there is no result just return false
    return false;
  }

  /**
   * @author Ravi Shah
   * Remove Empty Attribute and Blank Object or an Array
   * @param {*} obj
   * @returns
   * @memberof StandardAgGridService
   */
  removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === "object" && Object.keys(obj[key]).length === 0) {
        delete obj[key];
      } else if (obj[key] && typeof obj[key] === "object") {
        this.removeEmpty(obj[key]); // recurse
      } else if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  };


  /**
   * @author Ravi Shah
   * Maintain the Default Settings
   * @param {string} gridName
   * @param {*} defaultGridState
   * @memberof StandardAgGridService
   */
  public maintainDefaultGridState(gridName: string, defaultGridState: any) {
    let defaultStateSettings = this.removeEmpty(defaultGridState);
    this.defaultGridState[gridName] = defaultStateSettings;
  }

  /**
   * @author Ravi Shah
   * Get the Default Grid Settings
   * @param {string} gridName
   * @returns
   * @memberof StandardAgGridService
   */
  public getDefaultGridState(gridName: string) {
    return this.defaultGridState[gridName] || {}
  }

  /**
   * @author Ravi Shah
   * Call the Save Grid Setting API
   * @param {*} dataItem
   * @returns
   * @memberof StandardAgGridService
   */
  public saveGridSettings(dataItem: any) {
    return new Promise((resolve, reject) => {
      this.commonAPIService.getPromiseResponse({ apiName: '/preference/saveGridPref', parameterObject: dataItem }).then((result) => {
        resolve(true);
      }, error => {
        reject(error);
      })
    })

  }
}
