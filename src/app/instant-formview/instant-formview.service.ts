import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PreviewService {
    // Constructor
    constructor(private http: HttpClient) { }

    // call static server
    public getStaticData(taxYear, packageName, stateName, docName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.static_url}/${taxYear}/content/${packageName}/${stateName}/printing/v1/${docName}.json`).toPromise().then(
                response => {
                    resolve(response);
                },
                (error: HttpErrorResponse) => {
                    reject(error.error);
                }
            )
        })
    }

    //+ '/2018/content/1040/federal/documents/v1/'+docName+ '.json'
    public getFieldType(taxYear,packageName,stateName, docName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.static_url}/${taxYear}/content/${packageName}/${stateName}/documents/v1/${docName}.json`).toPromise().then(
                response => {
                    resolve(response);
                },
                (error: HttpErrorResponse) => {
                    reject(error.error);
                }
            )
        })
    }
}