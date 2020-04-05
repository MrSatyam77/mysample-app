import { Injectable } from '@angular/core';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { UserService } from '@app/shared/services/user.service';
import { APINAME } from '@app/dashboard/dashboard.constants';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsService {

  private bankList = [];
  private bankProducts: any = [];
  private atlasBankXml: any;
  private epsBankFeeDetails: any;
  private refundAdvantageBankFeeDetails: any;
  private tpgBankFeeDetails: any;
  private redBirdBankDetails: any;
  private isProtectionPlusEnrolledDone = false;
  private protectionPlusDetails = {};

  constructor(private commonApiSevice: CommonAPIService, private userService: UserService) { }

  public betaOnly() {
    if (environment.mode == 'local' || environment.mode == 'beta') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Om kanada
   * @description
   *         Call bank status api.
   */
  public getBankProducts() {
    const self = this;
    let bankProductsList = [];
    return new Promise((resolve, reject) => {
      self.commonApiSevice.getPromiseResponse({ apiName: APINAME.GET_BANK_PRODUCT }).then((response) => {
        // API return data in Different format, we need to format data in defined structure.
        self.bankProducts = response.data;
        // Start - tax year code
        // condition to decide bank products according to taxYear
        if (self.userService.getTaxYear() === '2014') {
          bankProductsList = [{ bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' }, { bankType: 'ATLAS', displayName: 'ATLAS', status: 'Not Enrolled' }];
        } else if (self.userService.getTaxYear() === '2015') {
          bankProductsList = [{ bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' }, { bankType: 'ATLAS', displayName: 'ATLAS', status: 'Not Enrolled' },
          { bankType: 'REFUNDADVANTAGE', displayName: 'Refund Advantage Enrollment', status: 'Not Enrolled' }, { bankType: 'TPG', displayName: 'Santa Barbara TPG Enrollment', status: 'Not Enrolled' },
          { bankType: 'REDBIRD', displayName: 'REDBIRD', status: 'Not Enrolled' }, { bankType: 'AUDITALLIES', displayName: 'Audit Allies', status: 'Not Enrolled' }];
        } else if (self.userService.getTaxYear() === '2016') {
          bankProductsList = [{ bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' },
          { bankType: 'REFUNDADVANTAGE', displayName: 'Refund Advantage Enrollment', status: 'Not Enrolled' },
          { bankType: 'TPG', displayName: 'Santa Barbara TPG Enrollment', status: 'Not Enrolled' },
          { bankType: 'PROTECTIONPLUS', displayName: 'Protection Plus Enrollment', status: 'Not Enrolled' },
          { bankType: 'NAVIGATOR', displayName: 'Navigator Enrollment', status: 'Not Enrolled' }
          ];
        } else if (self.userService.getTaxYear() === '2017') {
          bankProductsList = [
            { bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' },
            { bankType: 'TPG', displayName: 'Santa Barbara TPG Enrollment', status: 'Not Enrolled' },
            { bankType: 'REFUNDADVANTAGE', displayName: 'Refund Advantage Enrollment', status: 'Not Enrolled' },
            { bankType: 'PROTECTIONPLUS', displayName: 'Protection Plus Enrollment', status: 'Not Enrolled' },
            { bankType: 'NAVIGATOR', displayName: 'Navigator Enrollment', status: 'Not Enrolled' }
          ];
        } else if (self.userService.getTaxYear() === '2018') {
          bankProductsList = [
            { bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' },
            { bankType: 'TPG', displayName: 'Santa Barbara TPG Enrollment', status: 'Not Enrolled' },
            { bankType: 'REFUNDADVANTAGE', displayName: 'Refund Advantage Enrollment', status: 'Not Enrolled' },
            { bankType: 'PROTECTIONPLUS', displayName: 'Protection Plus Enrollment', status: 'Not Enrolled' },
            { bankType: 'NAVIGATOR', displayName: 'Navigator Enrollment', status: 'Not Enrolled' }
            // { bankType: 'EPAY', displayName: 'e-Pay', status: 'Not Enrolled' }
          ];
        } else if (self.userService.getTaxYear() === '2019') {
          bankProductsList = [
            { bankType: 'EPS', displayName: 'EPS Financial Enrollment', status: 'Not Enrolled' },
            { bankType: 'TPG', displayName: 'Santa Barbara TPG Enrollment', status: 'Not Enrolled' },
            { bankType: 'REFUNDADVANTAGE', displayName: 'Refund Advantage Enrollment', status: 'Not Enrolled' },
            { bankType: 'PROTECTIONPLUS', displayName: 'Protection Plus Enrollment', status: 'Not Enrolled' },
          ];

        } else {
          bankProductsList = [];
        }

        self.bankList = [];
        self.atlasBankXml = {};
        self.epsBankFeeDetails = {};
        self.refundAdvantageBankFeeDetails = {};
        self.tpgBankFeeDetails = {};
        self.redBirdBankDetails = {};
        self.isProtectionPlusEnrolledDone = false;
        self.protectionPlusDetails = {};

        if (self.bankProducts) {
          bankProductsList.forEach((obj, index) => {
            // var findData = _.find(bankProducts, { bankType: obj.bankType });
            // const findData = bankProducts.find((bankData) => { if (bankData.bankType === obj.bankType) { return bankData.bankType; } });
            const findData = self.bankProducts.find((bankData) => bankData.bankType === obj.bankType);

            if (findData) {
              let status = '';
              if (findData.atlasStatusDesc && findData.atlasStatusDesc !== '') {
                status = findData.atlasStatusDesc;
                bankProductsList[index].longDescription = status + '-' + findData.atlasStatusLongDesc;
              } else if (findData.status && findData.status !== '') {
                /*this statement  replace  particular bank type status in index wise.*/
                status = findData.status;
                if (status === 'Not Enrolled-Errors') {
                  status = 'Error';
                }
                bankProductsList[index].longDescription = status;
              }

              bankProductsList[index].status = status;
              // get userDetails from user service
              let userDetails = this.userService.getUserDetails();
              // Change for new Bank
              // Prepare bank list for bankProductLookup
              // ATLAS IF atlas status is '19'
              // EPS IF status is 'enrolled'
              if (findData.bankType.toUpperCase() === 'ATLAS') {
                if (findData.atlasStatus !== undefined && findData.atlasStatus.toString() === '19') {
                  self.atlasBankXml = findData.bankXml;
                  self.atlasBankXml.atlasStatus = findData.atlasStatus;
                  if (userDetails.isDemoUser === true || this.userService.getTaxYear() !== '2018') {
                    self.bankList.push('ATLAS');
                  }
                }
              } else if (findData.bankType.toUpperCase() === 'NAVIGATOR') {
                if (findData.atlasStatus !== undefined && findData.atlasStatus.toString() === '19') {
                  self.atlasBankXml = findData.bankXml;
                  self.atlasBankXml.atlasStatus = findData.atlasStatus;
                  self.bankList.push('NAVIGATOR');

                }
              } else if (findData.bankType.toUpperCase() === 'EPS') {
                if (findData.status !== undefined && findData.status.toLowerCase() === 'enrolled') {
                  self.epsBankFeeDetails = findData.bankFeeDetails;
                  self.epsBankFeeDetails.epsStatus = findData.status;
                  if (this.betaOnly() === true || userDetails.isDemoUser == true || this.userService.getTaxYear() != '2019') {
                    self.bankList.push('EPS');
                  }
                }
              } else if (findData.bankType.toUpperCase() === 'REFUNDADVANTAGE') {
                if (findData.status !== undefined && findData.status.toLowerCase() === 'enrolled') {
                  self.refundAdvantageBankFeeDetails = findData.bankFeeDetails;
                  self.refundAdvantageBankFeeDetails.refundAdvantageStatus = findData.status;
                  if (this.betaOnly() === true || userDetails.isDemoUser == true || this.userService.getTaxYear() != '2019') {
                    self.bankList.push('REFUNDADVANTAGE');
                  }
                }
              } else if (findData.bankType.toUpperCase() === 'TPG') {
                if (findData.status !== undefined && findData.status.toLowerCase() === 'enrolled') {
                  self.tpgBankFeeDetails = findData.bankFeeDetails;
                  self.tpgBankFeeDetails.tpgStatus = findData.status;
                  if (this.betaOnly() === true || userDetails.isDemoUser == true || this.userService.getTaxYear() != '2019') {
                    self.bankList.push('TPG');
                  }
                }
              } else if (findData.bankType.toUpperCase() === 'REDBIRD') {
                if (findData.status !== undefined && findData.status.toLowerCase() === 'enrolled') {
                  self.redBirdBankDetails = findData.bankFeeDetails;
                  self.bankList.push('REDBIRD');
                }
              } else if (findData.bankType.toUpperCase() === 'PROTECTIONPLUS') {
                if (findData.status !== undefined && findData.status.toLowerCase() === 'enrolled') {
                  self.isProtectionPlusEnrolledDone = true;
                  self.protectionPlusDetails = findData;
                }
              } else if (findData.bankType.toUpperCase() === 'EPAY') {

              }
            }
          });
        }

        resolve(bankProductsList);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Om kanada
   * @description
   *         This will help to check if any call made to this api.
   */
  public isBankProductCalled() {
    return this.bankProducts.length > 0;
  }

  /**
   * @author Om kanada
   * @description
   *        return atlas bankXml data.
   */
  getAtlasBankXml() {
    return this.atlasBankXml;
  }

  /**
   * @author Om kanada
   * @description
   *        Change for new Bank
   *        return EPS bankFeeDetails
   */
  getEPSBankFeeDetails() {
    return this.epsBankFeeDetails;
  }

  /**
   * @author Om kanada
   * @description
   *        Change for new Bank
   *        return Refund Advantage Details
   */
  getRefundAdvantageBankFeeDetails() {
    return this.refundAdvantageBankFeeDetails;
  }

  /**
   * @author Om kanada
   * @description
   *        Change for new Bank
   *        return TPG Details
   */
  getTPGBankFeeDetails() {
    return this.tpgBankFeeDetails;
  }
  /**
   * @author Om kanada
   * @description
   *      Change for new Bank
   *      return REDBIRD Details
   */
  getRedBirdBankDetails() {
    return this.redBirdBankDetails;
  }


  /**
   * @author Om kanada
   * @description
   *      return list of bank names to be elligible for bank products
   */
  getBankList() {
    return this.bankList;
  }

  /**
   * @author Om kanada
   * @description
   *      Get Protection plus status
   */
  getProtectionPlusStatus() {
    return this.isProtectionPlusEnrolledDone;
  }

  /**
   * @author Om kanada
   * @description
   *      Get protection plus details
   */
  getProtectionPlusDetails() {
    return this.protectionPlusDetails;
  }

}


