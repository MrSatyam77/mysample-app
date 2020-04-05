// External imports
import { Component, OnInit, TemplateRef, ViewChild, EventEmitter, Output, Input, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

// Internal imports
import { GridTemplateRendererComponent } from '@app/shared/components/grid-template-renderer/grid-template-renderer.component';
import { RTCSocketService, LocalStorageUtilityService, IntroService } from '@app/shared/services/index';
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-instance-preview-session',
    templateUrl: './instance-preview-session.component.html',
    styleUrls: ['./instance-preview-session.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InstancePreviewSessionComponent implements OnInit, AfterViewInit {

    @Output() closePreview = new EventEmitter<boolean>();
    @Input() newDeviceRequest;
    @ViewChild('connectActionCell', { static: true }) disconnectActionCell: TemplateRef<any>;
    public enableLoading = false;
    // @ViewChild('t', { static: true }) ngbTabset: NgbTabset;

    public deviceInfo: any = {};

    constructor(private routes: Router, private localStorageUtilityService: LocalStorageUtilityService, private introService: IntroService,
        private cd: ChangeDetectorRef, private rtcSocketService: RTCSocketService) { }

    redirectToAuthorizeDevice() {
        this.routes.navigate(['/instantFormView/authorizeDevice']);
        this.closePreview.emit(true);
    }

    disconnect() {
        this.rtcSocketService.emit('closeConnection',
        {deviceId: this.localStorageUtilityService.getFromLocalStorage('instantFormViewDeviceId')}, () => {

        });
        this.localStorageUtilityService.removeFromLocalStorage("instantFormViewDeviceId");
    }

    ngAfterViewInit() {
        if (this.newDeviceRequest !== true) {
            this.cd.detectChanges();
        }
    }

    ngOnInit() {
        const instantFormViewDeviceId = this.localStorageUtilityService.getFromLocalStorage('instantFormViewDeviceId');
        if (instantFormViewDeviceId) {
            this.enableLoading = true;
            this.cd.detectChanges();
            this.introService.getDeviceDetail(instantFormViewDeviceId).then((res) => {
                this.deviceInfo = res;
                const duration = moment.duration(moment().diff(this.deviceInfo.createdDate));
                // duration in hours
                const hours = duration.asHours().toFixed(2);
                if (hours) {
                    const hr = hours.split('.')[0];
                    if (hr.length === 1) {
                        this.deviceInfo.time = '0' + hours.replace('.', ':') + 'hrs';
                    } else {
                        this.deviceInfo.time = hours.replace('.', ':') + 'hrs';
                    }
                }
                this.enableLoading = false;
                this.cd.detectChanges();
            });
        }
    }
}
