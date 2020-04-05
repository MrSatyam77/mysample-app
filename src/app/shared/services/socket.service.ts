// External Imports
import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

// Internal Imports
import { environment } from "@environments/environment";

@Injectable({
    providedIn: 'root'
})

export class SocketService {

    private socket: any;

    // establish connection with socket server
    public connect(): void {
        if (this.socket === undefined) {
            this.socket = io.connect(`${environment.websocket_url}`, {
                'reconnection': true,
                'reconnectionDelay': 20000,
                'reconnectionDelayMax': 30000,
                'reconnectionAttempts': 10
            });
        }
    }

    // Disconnect connection
    public close(): void {
        if (this.socket !== undefined) {
            this.socket.close();
            this.socket = undefined;
        }
    }

    // Listen event on and publish the message
    public on(eventName: string, callback: any): void {
        const self = this;
        if (self.socket !== undefined) {
            self.socket.on(eventName, function (): void {
                const args = arguments;
                if (callback) {
                    callback.apply(self.socket, args);
                }
            });
        }
    }

    // Listen event emit and publish the message
    public emit(eventName: string, data: any, callback: any): void {
        if (this.socket !== undefined) {
            this.socket.emit(eventName, data, function (): void {
                const args = arguments;
                if (callback) {
                    callback.apply(this.socket, args);
                }
            });
        }
    }

    public unregister(eventName: string, callback: any): void {
        if (this.socket !== undefined) {
            this.socket.off(eventName);
        }
    }

}