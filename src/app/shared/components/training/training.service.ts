// External imports
import { Injectable } from '@angular/core';
// Internal imports
import { CommonAPIService } from '../../services/common-api.service';
import { MediaService } from '../../services/media.service';
import { APINAME } from '@app/shared/shared.constants';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  public static = [
    {
      "description": "This document provides information about how taxpayers can capture their signatures using MyTAXPortal.",
      "id": "98695bff-7694-403b-af27-37883e8460e3",
      "shortDescription": "This document provides information about how taxpayers can capture their signatures using MyTAXPortal.",
      "title": "Capturing Remote Signatures-Taxpayer and Spouse",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/capturing-remote-signatures-taxpayer-and-spouse/98695bff-7694-403b-af27-37883e8460e3"
    },
    {
      "description": "This document provides overview about how to manage invited clients within MyTAXPortal. It also includes information about how will this client communication reflect in MyTAXPrepOffice",
      "id": "6371ad5e-c4e4-4957-b1b6-14b613f6be63",
      "shortDescription": "This document provides overview about how to manage invited clients within MyTAXPortal. It also includes information about how will this client communication reflect in MyTAXPrepOffice",
      "title": "MyTAXPortal - Manage Invited Clients",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/mytaxportal---manage-invited-clients/6371ad5e-c4e4-4957-b1b6-14b613f6be63"
    },
    {
      "description": "This document provides details about requesting and approving remote signatures of taxpayers.",
      "id": "89c44013-2d50-47eb-bfac-b05f7345d9b7",
      "shortDescription": "This document provides details about requesting and approving remote signatures of taxpayers.",
      "title": "Requesting and Approving Remote Signatures",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/requesting-and-approving-remote-signatures/89c44013-2d50-47eb-bfac-b05f7345d9b7"
    },
    {
      "description": "This document provides overview about how taxpayers can review returns you send to them using MyTAXPortal .",
      "id": "5f4fb136-4a0b-4387-8258-c7171d98a2ff",
      "shortDescription": "This document provides overview about how taxpayers can review returns you send to them using MyTAXPortal .",
      "title": "Reviewing a Return-Taxpayer",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/reviewing-a-return-taxpayer/5f4fb136-4a0b-4387-8258-c7171d98a2ff"
    },
    {
      "description": "This document informs the taxpayer that how to send signature remotely when requested by tax preparer.",
      "id": "a2d27710-9371-4d51-9eb9-7d3cfc8d6fd1",
      "shortDescription": "This document informs the taxpayer that how to send signature remotely when requested by tax preparer.",
      "title": "Sending Your Signature Remotely – Taxpayer",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/sending-your-signature-remotely-–-taxpayer/a2d27710-9371-4d51-9eb9-7d3cfc8d6fd1"
    },
    {
      "description": "This document provides information regarding how to receive notifications about activities in MyTAXPortal, as well as informative reminders and alerts from MyTAXPrepOffice for Admin users.",
      "id": "516d9a92-f4b8-47f9-92de-b84f643f75b1",
      "shortDescription": "This document provides information regarding how to receive notifications about activities in MyTAXPortal, as well as informative reminders and alerts from MyTAXPrepOffice for Admin users.",
      "title": "Receiving Notifications",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/receiving-notifications/516d9a92-f4b8-47f9-92de-b84f643f75b1"
    },
    {
      "description": "This document provides overview about sending returns to clients for review.",
      "id": "557581f1-7ae5-4f7f-b33b-c16ed78179fb",
      "shortDescription": "This document provides overview about sending returns to clients for review.",
      "title": "Sending a Return to the Taxpayer for Review",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/sending-a-return-to-the-taxpayer-for-review/557581f1-7ae5-4f7f-b33b-c16ed78179fb"
    },
    {
      "description": "This document informs the taxpayer that how to upload a document tax preparer.",
      "id": "6e1be49a-0871-412a-bd28-8688aa192432",
      "shortDescription": "This document informs the taxpayer that how to upload a document tax preparer.",
      "title": "Uploading a Document – Taxpayer",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/uploading-a-document-–-taxpayer/6e1be49a-0871-412a-bd28-8688aa192432"
    },
    {
      "description": "This document informs the taxpayer that how to review the return sent by tax preparer.",
      "id": "0c52836b-dbed-4114-a98e-6aa71e424964",
      "shortDescription": "This document informs the taxpayer that how to review the return sent by tax preparer.",
      "title": "Reviewing Your Return – Taxpayer",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/reviewing-your-return-–-taxpayer/0c52836b-dbed-4114-a98e-6aa71e424964"
    },
    {
      "description": "This document informs the taxpayer that how to accept a MyTAXPortal invitation sent by tax preparer.",
      "id": "cd4b491e-2e4a-4af2-a9f1-71341b08a457",
      "shortDescription": "This document informs the taxpayer that how to accept a MyTAXPortal invitation sent by tax preparer.",
      "title": "Accepting an Invitation",
      "isEnable": true,
      "total": 50,
      "aggregations": {
        "cardinality_id": {
          "value": 50
        }
      },
      "link": "https://training.mytaxprepoffice.com/#/training/accepting-an-invitation/cd4b491e-2e4a-4af2-a9f1-71341b08a457"
    }
  ]

  constructor(private commonApiService: CommonAPIService, private mediaService: MediaService) { }
  /**
   * @author om kanada
   * @description this method is use to get training data
   * @param moduleName pass module name
   * @param mode pass  mode name
   * @param currentForm pass current open form name
   * @param field pass feild name which is taken
   * @param isManuallyRefresh manuallyrefresh is or not
   * @param conversionSofwareName name of conversion software name
   */
  getTrainingData(moduleName, mode, currentForm, field, isManuallyRefresh, conversionSofwareName?) {
    return new Promise((resolve, reject) => {
      const apiUrl = '/training/get?currentForm=' + currentForm + '&field=' + field + '&mode=' + mode + '&module=' + moduleName + "&conversionType=" + ((moduleName == 'conversion') ? conversionSofwareName : undefined)
      if (moduleName && mode) {
        // tslint:disable-next-line:max-line-length
        this.commonApiService.getPromiseResponse({ apiName: apiUrl, methodType: 'get' }).then((response: any) => {
          resolve(response.data);
        }, (error) => {
          // resolve(this.static);
          reject(error);
        });
      }
      if (field && !isManuallyRefresh) {
        this.mediaService.callView(moduleName, mode, currentForm, undefined);
      }
    });
  }
}
