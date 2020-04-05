// External Imports
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Internal Imports
import { AuthenticationService } from "@app/authentication/authentication.service";
import { LocalStorageUtilityService, DialogService, MessageService, UserService, ResellerService, BasketService } from "@app/shared/services/index";
import { NavigatorUserInstructionComponent } from "@app/shared/components/navigator-user-instruction/navigator-user-instruction.component";
import { PrivilegesInfoComponent } from '@app/shared/components/privileges-info/privileges-info.component';
import { ConversionUploaderservice } from "@app/conversion/conversion-uploader.service";
import { environment } from '@environments/environment';


@Injectable({
    providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
    constructor(
        private _authService: AuthenticationService,
        private _localStorageUtilityService: LocalStorageUtilityService,
        private _dialogService: DialogService,
        private _messageService: MessageService,
        private _router: Router,
        private _userService: UserService,
        private _resellerService: ResellerService,
        private _conversionUploaderservice: ConversionUploaderservice,
        private _basketService: BasketService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const nextRoute = state.url;
        const access = route.data.access;
        //change for 2019 allowed feature
        if (environment.mode == 'production' && this._userService.getTaxYear() == '2019' && nextRoute.indexOf('/bank') != 0 && nextRoute != '/registration' && nextRoute != '/login' && nextRoute != '/logout' && nextRoute != '/manage/change/password' && nextRoute != '/registration' && nextRoute != '/home' && nextRoute != '/alert/allowedFeature' && nextRoute.indexOf('/office') != 0 && nextRoute.indexOf('/manage') != 0 && nextRoute.indexOf('/preferences') != 0 && nextRoute.indexOf('/home/settings') != 0 && nextRoute != '/alert/privilegesInfo' && nextRoute.indexOf('/instantFormView') != 0 && nextRoute.indexOf('/conversionnew') != 0) {
            this._router.navigate(['/alert/allowedFeature']);
            return false;
        }
        if (access && access.requiredAuthentication === true) {
            if (!this._authService.getIsAuthenticated() || this._localStorageUtilityService.checkLocalStorageKey('xsrfToken') === false) {
                this._authService.setLastUserPath(nextRoute);
                this._router.navigate(['/login']);
                return false;
            } else {
                if (this._authService.getIsAuthenticated() && this._userService.getIsPasswordChangeRequired() && nextRoute.indexOf("/manage/change/password") < 0) {
                    this._router.navigateByUrl('/manage/change/password/expire');
                    return false;
                }
                else if (this._authService.getIsAuthenticated() && this._userService.getIsNavigatorUser()) {
                    this._router.navigateByUrl('/home');
                    // open instruction dialog.
                    this.openNavigatorInstructionDialog();
                    return false;
                }
                else if (this._authService.getIsAuthenticated() && nextRoute.indexOf("logout") != -1 && this._conversionUploaderservice.hasUploadStart) {
                    this.openCancelUploadDialog(state);
                    return false;
                }
                else {
                    this._authService.setLastUserPath("");
                    let userDetail = this._userService.getUserDetails();
                    if (access.privileges && access.privileges.length > 0) {
                        //check for each privileges. It may possible we require more then one privilege for some module
                        for (let privilege of access.privileges) {
                            if (this._userService.can(privilege) === false) {
                                if (userDetail.currentLocationId) {
                                    this.showRequiredPrivilegesAlert(access.privileges);
                                } else {
                                    this._router.navigateByUrl("/office/selection");
                                }
                                return false;
                            }
                        };
                    }
                    if (access.featureName) {
                        //call the resellerService function to check whether the feature exist in featureToRemove of resellerConfig
                        if (!this._resellerService.hasFeature(access.featureName)) {
                            //cancel route change request
                            return false;
                        }
                    }
                }
            }
        } else {
            if (nextRoute.indexOf("/login") > -1) {
                if (this._authService.getIsAuthenticated() && this._localStorageUtilityService.checkLocalStorageKey('xsrfToken') === true) {
                    if (!this._authService.lastUserPath || this._authService.lastUserPath === '') {
                        this._router.navigateByUrl('/home');
                    } else {
                        this._router.navigateByUrl(this._authService.lastUserPath)
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @author Hannan Desai
     * @description This function is used to open instruction dialog for navigtor customer and stops him to do any work untill he purchase a software.
     */
    private openNavigatorInstructionDialog() {
        const self = this;
        const dialogRef = self._dialogService.custom(NavigatorUserInstructionComponent, undefined, {});
        dialogRef.result.then((result) => {
            if (result) {
                //For Media API
                // mediaService.callView('logout', '', '');
                //Call logout api
                self._authService.logout().then(function (success) {
                    // Issue :- manually bootstrap IF possible.
                    window.location.reload(true);
                    self._messageService.showMessage('Logged Out Successfully', 'success', 'HEADERNAVCON_LOGOUTSUCCESS_MSG');
                }, function (error) {
                    console.error(error);
                });
            }
        })
    }

    /**
     * @author Hannan Desai
     * @description This function is used to open info dialog when user try to open page, that require privilege and user dont have that privilege.
     */
    private showRequiredPrivilegesAlert(privileges: Array<any>) {
        this._basketService.pushItem("requireprivileges", { privilegesList: privileges })
        this._router.navigate(["/alert/privilegesInfo"]);
        // this._dialogService.custom(PrivilegesInfoComponent, { privilegesList: privileges }, {});
    }

    /**
     * @author Hitesh Soni
     * @description This function used to show confirmation dialog when Conversion Upload is going on
     */
    private openCancelUploadDialog(state: RouterStateSnapshot) {
        let dialogRef = this._dialogService.confirm({ title: 'Confirmation', text: 'The upload is going on, are you sure you want to cancel it?' }, { size: "md" });
        dialogRef.result.then((result) => {
            if (result.toLowerCase() == "yes") {
                this._conversionUploaderservice.uploadCancel()
                    .then((response) => {
                        if (response) {
                            this._router.navigateByUrl('/logout');
                        }
                    });
            }
        });
    }
}
