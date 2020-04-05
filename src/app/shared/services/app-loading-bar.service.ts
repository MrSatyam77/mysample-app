// External Imports
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class AppLoadingBarService {

    private appLoadingBarRequestList: Array<string> = [];
    
    /**
     * @author Hannan Desai
     * @param featureName
     *          contains for which feature we are enabling this loading bar.
     * @description
     *          This function is used show app loading bar for fetures like system loading, service worker and auto login.
     */
    public enableAppLoadingBar(featureName: string) {

    }

    /**
     * @author Hannan Desai
     * @param featureName 
     *          conatins for which feature we are disabling this loading bar.
     * @description
     *          This function is used hide app loading bar for given feature.
     */
    public disableAppLoadingBar(featureName: string) {

    }
}