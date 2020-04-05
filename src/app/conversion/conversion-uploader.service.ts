/** Extrenal import */
import { Injectable, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef } from "@angular/core";
import * as resumable from '../../assets/js/resumable.js';
import { Subject } from 'rxjs';
/** Internal import */
import { environment } from "../../environments/environment";
import { CommonAPIService } from '@app/shared/services/index.js';
import { APINAME } from './conversion.constant.js';

@Injectable({ providedIn: "root" })
export class ConversionUploaderservice {
    /** Public varibale */
    resumableUpload: any;
    invalidFiles: any;
    invalidFileEvent = new Subject<string>();
    fileProgressEvent = new Subject<number>();
    hasUploadComplete = new Subject<boolean>();
    jobData: any;
    hasUploadStart: boolean;
    /** Private variable */
    private componentRef: any;
    private processCount = 0;
    private process;
    private SWPattern: any;
    totalFiles: number;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private commonApiService: CommonAPIService
    ) { }

    /** Create Resumable objects */
    createResumableObject(supportExtension, softwareName) {
        let _self = this;
        this.resumableUpload = new resumable.Resumable({
            target: `${environment.uploadServiceUrl}`,
            chunkSize: 3 * (1024 * 1024 * 1024),
            simultaneousUploads: 2,
            testChunks: false,
            throttleProgressCallbacks: 1,
            fileType: supportExtension,
            maxChunkRetries: 3,
            fileTypeErrorCallback: function (file) { },
            filesTypeErrorCallback: function (files) {
                _self.invalidFiles = files;
                _self.invalidFileEvent.next(files);
            }
        });
        this.initializeEvents()
    }
    /** intilize Events */
    initializeEvents() {
        let _self = this;
        this.resumableUpload.on('fileSuccess', function (file) {
            _self.resumableUpload.removeFile(file)
            _self.processCount++;
            let per = Math.floor((_self.processCount * 100) / (_self.totalFiles));
            _self.process = per;
            _self.fileProgressEvent.next(per);
        });

        this.resumableUpload.on('uploadStart', function () {
            if (!_self.hasUploadStart) {
                // _self.appendComponentToBody();
                _self.hasUploadStart = true;
                _self.hasUploadComplete.next(false);
            }
            console.log("Uploading....");
        });

        this.resumableUpload.on('complete', function () {
            //_self.removeComponent();
            _self.hasUploadStart = false;
            _self.hasUploadComplete.next(true);
            console.log("Uploading complete");
            _self.fileProgressEvent.next(100);
        });

        this.resumableUpload.on('fileError', function (file) {
            //_self.removeComponent();
            _self.hasUploadStart = false;
            _self.resumableUpload.removeFile(file)
            console.log("Error in uploading");
        });

        this.resumableUpload.on('pause', function () {
            // Show resume, hide pause
            console.log("Upload pause");
        });
        this.resumableUpload.on('error', function () {
            // Show resume, hide pause
            _self.hasUploadComplete.next(true);
            console.log("error call");
        });
    }

    /** custom file validation for TaxWise */
    customFileValidations(SWPattern, taxYear) {
        this.invalidFiles = [];
        this.resumableUpload.files.forEach(element => {
            let isInvalid = false;
            for (const pattern of SWPattern.pattern) {
                isInvalid = false;
                let fileRegex = new RegExp(pattern);
                if (SWPattern.name == "taxwise") {
                    if (!fileRegex.test(element.fileName) || element.fileName.substring(2) == "000000.000") {
                        isInvalid = true;
                    }
                    else {
                        isInvalid = false;
                        break;
                    }
                }
                else if (SWPattern.name == "crosslink") {
                    //in crosslink filename contain next year from the current year like for 2018 file contain 19
                    let year = (parseInt(taxYear.substring(taxYear.length - 2)) + 1).toString();
                    if (element.fileName.length == 12 || element.fileName.length == 18) {
                        if (fileRegex.test(element.fileName)) {
                            if (element.fileName.indexOf(year) == -1) {
                                isInvalid = true;
                            }
                            else {
                                isInvalid = false;
                                break;
                            }
                        }
                        else {
                            isInvalid = true;
                        }
                    }
                    else {
                        isInvalid = true;
                    }
                }
            }
            if (isInvalid) {
                this.invalidFiles.push(element);
            }
        });
        this.invalidFileEvent.next(this.invalidFiles);
    }

    appendComponentToBody() {
        // // Create a component reference from the component 
        // this.componentRef = this.componentFactoryResolver.resolveComponentFactory(StickComponent).create(this.injector);
        // // Attach component to the appRef so that it's inside the ng component tree
        // this.appRef.attachView(this.componentRef.hostView);
        // // Get DOM element from component
        // const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        // // Append DOM element to the body
        // document.body.appendChild(domElem);
    }

    removeComponent() {
        console.log(this.componentRef.hostView);
        this.appRef.detachView(this.componentRef.hostView);
        console.log(this.appRef.components);
        this.componentRef.destroy();
    }

    /** Get folder path */
    getFolderPath(path: string) {
        return path.substring(0, path.lastIndexOf("/"));
    }

    /** Clear objects */
    clearObjects() {
        this.invalidFiles = [];
        this.jobData = null;
        this.hasUploadStart = false;
    }

    /**
     * @author Hitesh Soni
     * @date 08-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof ConversionListService
     * @description Upload Close event
     */
    uploadCancel() {
        this.hasUploadStart = false;
        const self = this;
        let fileList = this.resumableUpload.files.map(x => x.fileName);
        this.resumableUpload.cancel();
        let requestData = { 'cjKey': this.jobData.jobId, fileList: fileList };
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