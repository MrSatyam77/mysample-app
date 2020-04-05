/** External import */
import { Injectable } from "@angular/core";
/** Internal import */
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from '../calendar.constants';

@Injectable()
export class SchedulerService {
    private color = "#34495e";
    private privateColor = "#0FA5B0";
    private textColor = "#fff";

    constructor(private commonApiService: CommonAPIService) { }

    /** Get Event List */
    public getEventList() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_EVENT_LIST }).then((response) => {
                if (response.data && response.data.length > 0) {
                    response.data.forEach(element => {
                        element.title = element.subject;
                        element.start = new Date(element.start);
                        element.end = new Date(element.end);
                        if (element.isPrivate) {
                            element.backgroundColor = this.privateColor;
                        } else {
                            element.backgroundColor = this.color;
                        }
                        element.color = this.textColor;
                        element.alertTime = element.alertTime ? new Date(element.alertTime) : undefined;
                    });
                    resolve(response.data)
                }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** Save Event */
    public saveEvent(data) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_EVENT, parameterObject: data }).then((response) => {
                if (response.data) {
                    resolve(response.data)
                }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }
}