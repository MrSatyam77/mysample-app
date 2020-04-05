import { Injectable } from "@angular/core";
import { APINAME } from '../conversion.constant';
import { CommonAPIService } from '@app/shared/services';

@Injectable()
export class ConversionDetailService {
    /** Public variable */
    // Set seletced software *
    selectedSoftware: any;

    /** Private variable */
    // Wizard View 
    private wizardView: any = [
        { "view": "welcome", "title": "Welcome", "isVisible": "true", "next": "second", "previous": "" },
        { "view": "software", "title": "Select Software", "isVisible": "false", "next": "third", "previous": "first" },
        { "view": "upload", "title": "Upload", "isVisible": "false", "next": "", "previous": "fourth" },
        { "view": "confirmation", "title": "Confirmation", "isVisible": "false", "next": "", "previous": "" }
    ];
    // Software name by year
    private softwareName: any = {
        "2017": {
            "2017": [
                { "text": "ATX 2017 (1040, 1065, 1120, 1120s)", "value": "ATX2017", "displayText": "ATX", "name": "ATX" },
                { "text": "Crosslink 2017 (1040)", "value": "Crosslink2017", "displayText": "CrossLink", "name": "Crosslink" },
                { "text": "Drake 2017 (1040,1065,1120,1120s)", "value": "Drake2017", "displayText": "Drake", "name": "Drake" },
                { "text": "Lacerte 2017 (1040,1065,1120,1120s)", "value": "Lacerte2017", "displayText": "Lacerte", "name": "Lacerte" },
                { "text": "OLTPRO 2017 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2017", "displayText": "OLT Pro", "name": "OLTPRO" },
                { "text": "Pro Series 2017 (1040,1065,1120,1120s)", "value": "ProSeries2017", "displayText": "Pro Series", "name": "ProSeries" },
                { "text": "TaxACT 2017 (1040)", "value": "TaxACT2017", "displayText": "TaxAct", "name": "TaxACT" },
                { "text": "TaxSlayer 2017 (1040)", "value": "TaxSlayer2017", "displayText": "TaxSlayer", "name": "TaxSlayer" },
                { "text": "TaxWise 2017 (1040, 1065, 1120, 1120s)", "value": "TaxWise2017", "displayText": "TaxWise", "name": "TaxWise" },
                { "text": "Turbo Tax 2017 (1040)", "value": "TurboTax2017", "displayText": "Turbo Tax", "name": "TurboTax" },
                { "text": "ProSystem FX 2017 (1040)", "value": "ProSystemFX2017", "displayText": "ProSystem FX", "name": "ProSystemFX" },
                { "text": "UltraTax 2017 (1040, 1065, 1120, 1120s)", "value": "UltraTax2017", "displayText": "UltraTax", "name": "UltraTax" }
            ]
        },
        "2018": {
            "2018": [
                { "text": "ProSeries Desktop (1040, 1065, 1120, 1120S)", "value": "ProSeries2018", "displayText": "Pro Series", "name": "ProSeries", icon: "assets/images/Intuit-ProSeries-Logo.jpg" },
                { "text": "ATX Desktop (1040, 1065, 1120, 1120S)", "value": "ATX2018", "displayText": "ATX", "name": "ATX", icon: "assets/images/ATXLogo.jpg" },
                { "text": "TaxWise Desktop (1040, 1065, 1120, 1120S)", "value": "TaxWise2018", "displayText": "TaxWise", "name": "TaxWise", icon: "assets/images/taxwise.jpg" },
                { "text": "Drake Desktop (1040, 1065, 1120, 1120S)", "value": "Drake2018", "displayText": "Drake", "name": "Drake", icon: "assets/images/drakeLogo.png", isDirectory: true },
                { "text": "TaxAct Desktop (1040)", "value": "TaxACT2018", "displayText": "TaxAct", "name": "TaxACT", icon: "assets/images/taxact_professional_large.gif" },
                { "text": "CrossLink Desktop (1040)", "value": "Crosslink2018", "displayText": "CrossLink", "name": "CrossLink", icon: "assets/images/crosslink.png" },
                { "text": "TurboTax Desktop (1040)", "value": "TurboTax2018", "displayText": "Turbo Tax", "name": "TurboTax", icon: "assets/images/turbotax logo.png" },
                { "text": "OltPro Desktop (1040, 1065, 1120, 1120S)", "value": "OLTPRO2018", "displayText": "OLT Pro", "name": "OLTPRO", icon: "assets/images/oltpro_logo.jpg" },
                { "text": "UltraTax (1040, 1065, 1120, 1120S)", "value": "ULTRATAX2018", "displayText": "UltraTax", "name": "UltraTax", icon: "assets/images/ultratax_logo.png", comingSoon: false, isDirectory: true },
                { "text": "ProSystem fx (1040)", "value": "PROSYSTEMFX2018", "displayText": "ProSystem fx", "name": "ProSystem fx", icon: "assets/images/logo_prosystem.png", comingSoon: true },
                { "text": "TaxSlayer (1040)", "value": "TAXSLAYER2018", "displayText": "TaxSlayer", "name": "TaxSlayer", icon: "assets/images/taxslayer_logo.png", comingSoon: true },
                { "text": "Lacerte (1040)", "value": "LACERTE2018", "displayText": "Lacerte", "name": "Lacerte", icon: "assets/images/lacerte.png", comingSoon: true }
            ]
        }
    };

    /** Software extension by name */
    private extension: any = {
        "2018": {
            "proseries": ['18C', '18c', '18I', '18i', '18P', '18p', '18S', '18s'],
            "atx": ['atx18backup'],
            "taxwise": [],
            "turbotax": ['tax2018'],
            "taxact": ['ba8', 'bs8', 'bc8', 'bp8', "BA8", "BS8", "BC8", "BP8"],
            "drake": ["DI8", "DP8", "DC8", "DS8", "Di8", "Dp8", "Dc8", "Ds8"],
            "oltpro": ['OLT18'],
            "crosslink": [],
            "ultratax": ['UT8']
        }
    }

    /** Validate file by pattern */
    private softwareFilePattern = [
        // { name: "taxwise", pattern: [`^[8]{1}[IPSC]{1}[0-9]{6}.[0-9]{3}`] },
        { name: "taxwise", pattern: [`^[8]{1}[IPSC]{1}[A-Z0-9]{1,6}.[A-Z0-9]{2,3}$`] },
        { name: "crosslink", pattern: [`(ar|bk)+\\d{2,10}$`, `(ar|bk)+\\d{2,16}$`] }
    ];

    constructor(private commonApiService: CommonAPIService) { }

    /** Public Method */
    /** Get Wizard */
    getWizardView() {
        return this.wizardView;
    }
    /** Get Software names by year */
    getSoftwareNames(year: string) {
        return this.softwareName[year][year];
    }

    /** Get extension by software */
    getExtension(year: string) {
        if (this.extension[year]) {
            return this.extension[year][this.selectedSoftware.name.toLowerCase()];
        }
        else return null;
    }

    /** Get name of duplicate file from new file list */
    getDuplicateFileList(newfileList: any, oldFileList) {
        let fileList = [];
        oldFileList.forEach(element => {
            let index = newfileList.findIndex(x => x.fileName == element.fileName);
            if (index != -1) {
                fileList.push(newfileList[index]);
            }
        });
        return fileList;
    }

    /** Get Pattern  */
    getPattern(selectedSoftware) {
        let index = this.softwareFilePattern.findIndex(x => x.name == selectedSoftware.name.toLowerCase());
        if (index != -1) {
            return this.softwareFilePattern[index];
        }
        else return null;
    }

    /** API for create new job */
    beforeUpload(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.BEFOREUPLOAD, parameterObject: data }).then((response) => {
                if (response.data) { resolve(response); }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** API update job data */
    updateJobData(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.UPDATEFILE_LIST, parameterObject: data }).then((response) => {
                if (response.data) { resolve(response); }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** API update job data */
    varifieFileList(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.VERIFYFILE_LIST, parameterObject: data }).then((response) => {
                if (response.data) { resolve(response); }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** Update customer decision*/
    updateCustomerDecision(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.UPDATE_CUSTOMER_DECISION, parameterObject: data }).then((response) => {
                if (response.data) { resolve(response); }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** Upload Cancel */
    uploadCancel(jobId, fileList) {
        const self = this;
        let requestData = { 'cjKey': jobId, fileList: fileList };
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.CANCEL_UPLOAD, parameterObject: requestData }).then((response) => {
                if (response.data) { resolve(response.data); }
                else { resolve(false); }
            }, (error) => {
                reject(error);
            });
        });
    }
}