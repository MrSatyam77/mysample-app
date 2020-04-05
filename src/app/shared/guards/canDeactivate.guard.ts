// External Imports
import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Internal Imports
import { DialogService } from '@app/shared/services';
import { CloseConfirmationComponent } from '@app/shared/components/close-confirmation/close-confirmation.component';

@Injectable({
    providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<any> {
    constructor(private _dialogService: DialogService) { }

    canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (component.haveUnsavedChanges()) {
                this._dialogService.custom(CloseConfirmationComponent, {}, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
                    .result.then((result: boolean) => {
                        if (result === true) {
                            // save here
                            if (component.saveBeforeRouteChange) {
                                component.saveBeforeRouteChange().then(() => {
                                    resolve(true);
                                }, error => {
                                    reject(false);
                                });
                            } else {
                                resolve(true);
                            }
                        } else {
                            resolve(true);
                        }
                    }, (error) => {
                        reject(false)
                    })
            } else {
                resolve(true);
            }
        })
    }
}