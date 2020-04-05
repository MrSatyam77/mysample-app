// External Imports
import { Injectable } from "@angular/core";

// Internal Imports
import { environment } from '@environments/environment';
import { ConfigService } from '@app/shared/services/config.service';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { UserService } from '@app/shared/services/user.service';
import { CommunicationService } from '@app/shared/services/communication.service';

@Injectable({
    providedIn: 'root'
})

export class ContentService {

    private urlPatternDefaults: string = '/{{taxyear}}/content/{{package}}/defaults/{{version}}/';
    private config: any = { baseURL: environment.static_url };

    constructor(
        private _configService: ConfigService,
        private _commonAPIService: CommonAPIService,
        private _userService: UserService,
        private _communicationService: CommunicationService) {
        this.config = Object.assign(this.config, this._configService.getConfigData());
        this.init();
    }

    private getDefaultsUrl(packageName: string) {
        var url = this.urlPatternDefaults.
            replace('{{taxyear}}', this.config.taxyear).
            replace('{{package}}', packageName).
            replace('{{version}}', this.config.versions[packageName]['defaults']);
        return url;
    }

    //Thi
    public getDefaultReturn(packageName: string) {
        return new Promise((resolve, reject) => {
            var defaultReturnURL = this.getDefaultsUrl(packageName) + 'return.json';
            //download it for current version and cache default in templateCache
            this._commonAPIService.getPromiseResponse({
                apiName: defaultReturnURL,
                methodType: "get",
                originKey: "static_url",
                responseType: "Text"
            }).then((response) => {
                resolve(JSON.parse(response.trim()));
            }, (error) => {
                console.error(error);
                reject(error);
            })
        })
    }

    public refreshTaxYear() {
        if (!this.config.taxyear || this.config.taxyear !== this._userService.getTaxYear()) {
            this.config.taxyear = this._userService.getTaxYear();
            //Need to load configuration again as taxyear changed
            //Load config data from configService (part of common services) and merge with local _config.
            Object.assign(this.config, this._configService.getConfigData(undefined, true));
        }

        // @removeInFuture
        this._communicationService.transmitData({ topic: "refreshTaxYear", channel: "contentService" });
    }

    private init() {
        //Set Tax Year
        this.refreshTaxYear();
        //Set Return Mode
        this.config.returnMode = "input";
    }
}