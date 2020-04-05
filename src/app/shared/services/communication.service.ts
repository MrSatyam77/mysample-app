// External Imports
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";

@Injectable({
    providedIn: 'root'
})

export class CommunicationService {
    public transmitter = new ReplaySubject(1);

    /**
     * @author Hannan Desai
     * @param data 
     *      Contains data that needs to be pass to other components.
     * @description
     *      This function is called by components whenever there is needs to pass data to other component.
     */
    public transmitData(data: ICommunctionData) {
        this.transmitter.next(data);
    }
}

interface ICommunctionData {
    topic: string;
    channel: string;
    data?: any;
}
