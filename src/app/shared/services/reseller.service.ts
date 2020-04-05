// External Imports
import { Injectable } from '@angular/core';

// Internal Imports
import { environment } from '@environments/environment';
import { APINAME } from '@app/shared/shared.constants';
import { CommonAPIService } from "@app/shared/services/common-api.service";

@Injectable({
    providedIn: 'root'
})
export class ResellerService {

    //variable that hold the reseller configuration
    public _resellerConfig: any;

    // holda domain names array for different resellers
    private resellerHostnames: any = [
        {
            hostNames: ['empiretax.advanced-taxsolutions.com', 'app-empiretax.org', 'www.app-empiretax.org'],
            configObj: { appId: "RE-9131fcf4-6906-4c97-bb13-d8dd94953acc", shortCode: "empiretax", browserSupport: {} }
        }, {
            hostNames: ['tsg.advanced-taxsolutions.com', 'app-tsgtaxpros.com', 'www.app-tsgtaxpros.com'],
            configObj: { appId: "RE-f58b8289-f20a-443f-9c30-1dd4d732c6f9", shortCode: "tsg", browserSupport: {} }
        }, {
            hostNames: ['siglo.advanced-taxsolutions.com', 'app-siglosoftware.com', 'www.app-siglosoftware.com'],
            configObj: { appId: "RE-1a54ef88-3118-46d9-8c75-6c316bd89420", shortCode: "siglo", browserSupport: {} }
        }, {
            hostNames: ['co9.advanced-taxsolutions.com', 'app-co9taxsoftware.com', 'www.app-co9taxsoftware.com'],
            configObj: { appId: "RE-c7b54ab5-10a9-4127-9692-9778a2cfa5bd", shortCode: "co9", browserSupport: {} }
        }, {
            hostNames: ['uplus.advanced-taxsolutions.com', 'app-uplustaxsoftware.com', 'www.app-uplustaxsoftware.com'],
            configObj: { appId: "RE-1c2d3f01-9c82-41b9-9f8c-e5ac6791552e", shortCode: "uplus", browserSupport: {} }
        }, {
            hostNames: ['trooblr.advanced-taxsolutions.com', 'app-trooblrtaxoffice.com', 'www.app-trooblrtaxoffice.com'],
            configObj: { appId: "RE-83f84f99-1633-4321-9a31-40e574efa33a", shortCode: "trooblr", browserSupport: {} }
        }, {
            hostNames: ['incomeusa.advanced-taxsolutions.com', 'app-incomeandinsurance.com', 'www.app-incomeandinsurance.com'],
            configObj: { appId: "RE-bcc6896f-dfb7-4e5e-83e5-b7b396fe521b", shortCode: "incomeusa", browserSupport: {} }
        }, {
            hostNames: ['sam.advanced-taxsolutions.com', 'app-swestcloud.com', 'www.app-swestcloud.com'],
            configObj: { appId: "RE-a80480dc-74b3-4b5f-be81-545a96a5ce12", shortCode: "sam", browserSupport: {} }
        }, {
            hostNames: ['123incometax.mytaxprepofficedemo.com', '123incometax.mytaxprepofficedemo.com', '123incometax.mytaxprepofficedemo.com'],
            configObj: { appId: "RE-67761ce4-274a-46b1-bf08-82c7fdd9a833", shortCode: "123incometax", browserSupport: {} }
        }, {
            hostNames: ['nextworld.advanced-taxsolutions.com', 'nextworldcommunications.mytaxprepoffice.com', 'nextworldcommunications.mytaxprepoffice.com'],
            configObj: { appId: "RE-0f923412-de9f-49bd-969b-c2b06fb763b3", shortCode: "nextworld", browserSupport: {} }
        }, {
            hostNames: ["cloudsotaxprep.mytaxprepoffice.com", "cloudsotaxprep.advanced-taxsolutions.com"],
            configObj: { appId: "RE-c2ed3e1a-ca97-4a8d-b0c6-02d26dfa2de5", shortCode: "cloudsolution", browserSupport: {} }
        }
    ]

    constructor(private commonApiService: CommonAPIService) { }

    /**
    * @author Heena Bhesaniya 
    * @description method to get the complete reseller config
    */
    public getResellerConfig() {
        return this._resellerConfig;
    };

    /**
    * @author Heena Bhesaniya 
    * @description method to get the nth level value from reseller config
    */
    public getValue(key, objData?) {
        let obj = (objData == undefined) ? this._resellerConfig : objData;
        for (let i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                if (i == key) {
                    return obj[i];
                } else {
                    this.getValue(key, obj[i]);
                }
            } else if (i == key) {
                return obj[i];
            }
        }
    };

    /**
    * @author Heena Bhesaniya
    * @description method to get the multiple value from the reseller config
    */
    public getValues(listOfProp) {
        let result = {};
        listOfProp.forEach(propName => {
            result[propName] = this.getValue(propName);
        });
        return result;
    };

    /**
    * @author Heena Bhesaniya 
    * @description method to set the reseller config object
    */
    public setResellerConfig(configObj) {
        this._resellerConfig = configObj;
        environment.reseller_config_global = configObj;
        //condition to check the environment mode, we will only update the url if the mode is not local
        if (environment.mode != 'local' && this._resellerConfig && this._resellerConfig.baseUrl && this._resellerConfig.staticUrl) {
            //updating the API and static url obtained from the reseller config by calling API
            environment.base_url = this._resellerConfig.baseUrl;
            environment.static_url = this._resellerConfig.staticUrl;
        }
    };

    /**
    * @author Heena Bhesaniya
    * @description method to check whether the feature is to be removed or not
    */
    public hasFeature(moduleName) {
        if (this._resellerConfig && this._resellerConfig.featureToRemove && this._resellerConfig.featureToRemove && this._resellerConfig.featureToRemove.indexOf(moduleName) != -1) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * @author Hannan Desai
     * @description
     *         This function is used to set resellet config initially based on app hostname.
     */
    private initializeResellerConfigBasedOnUarl() {
        const self = this;
        let resellerObj = self.resellerHostnames.find((reseller) => {
            return reseller.hostNames.indexOf(window.location.hostname) > -1;
        })
        if (resellerObj) {
            self._resellerConfig = resellerObj.configObj;
        } else {
            self._resellerConfig = { appId: 'RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', shortCode: 'mtpo', browserSupport: {} }
        }
    }

    /**
    * @author Heena Bhesaniya
    * @description method to get the reseller configuration by calling API.
    * @param appId = is the ID of the app whose configuration is needed.
    */
    public init(): any {
        const self = this;
        if (!self._resellerConfig) {
            self.initializeResellerConfigBasedOnUarl();
        }
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: '/reseller/configuration?appId=' + self._resellerConfig.appId, methodType: 'get' })
                .then((response: any) => {
                    self.setResellerConfig(response.data);
                    resolve(response);
                }, error => {
                    reject(error);
                });
        });
    };
}
