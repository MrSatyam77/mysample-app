export class APINAME {
    // get change location
    public static get LOCATION_CHANGE(): string { return "/location/openForChangeLocation" };

    // get location
    public static get LOCATION_OPEN(): string { return "/location/open" };

    // chnage default location
    public static get LOCATION_DEFAULT_CHANGE(): string { return "/auth/changeDefaultLocation" };

    // get user detail
    public static get USER_DETAIL_GET(): string { return "/auth/user/get" };

    // get user preference 
    public static get USER_GET_PREFRENCE(): string { return "/users/getPreferences" };

    // chnage user settings
    public static get USER_CHANGE_SETTING(): string { return "/auth/changeSettings" };

    // change user preference.
    public static get USER_CHANGE_PREFERENCE(): string { return "/users/changePreferences" };

    // get updated license status
    public static get LICENSE_GET_STATUS(): string { return "/location/license/status" };

    ///location/returnStatus/save
    public static get LOCATION_SAVE_RETURN_STATUS(): string { return "/location/returnStatus/save" };

    // chnage tax year
    public static get USER_CHANGE_TAXYEAR(): string { return "/auth/changeTaxYear" }; 

    // get user style preference.
    public static get USER_GET_STYLE_PREFRENCE(): string { return '/auth/style/user/preferences' };

    // get preparer list
    public static get USER_GET_PREPARER_LIST(): string { return "/preparer/list" };

    //  get reseller confuiguration 
    public static get GET_RESELLER_CONFIGURATION(): string { return '/reseller/configuration?appId='; }

    // get refund status link
    public static get GET_REFUNDSTATUS_LINKS(): string { return '/get/refundStatusLinkList'; }

    // get reseller style dashboard.
    public static get GET_RESELLER_STYLE_DASHBOARD(): string { return "/reseller/style/dashboard" };

    // keep allive api call
    public static get KEEP_ALIVE(): string { return '/auth/keepAlive'; }

    // get admin privileges
    public static get GET_ADMIN_PRIVILEGES(): string { return "/privileges/listForVerification"; }

    // navigator user instruction leave message
    public static get NAVIGATOR_LEAVE_MESSAGE(): string { return "/support/leaveMessage" }

    public static get NOTIFICATION_TOKEN_UPDATE(): string { return "/notification/token/update" }

    public static get NOTIFICATION_DOITLATER(): string { return "/notification/doItLater" }

    // Efile List Details
    public static get EFILE_LIST(): string { return "/efile/list" }

    // Efile Cancel
    public static get EFILE_CANCEL(): string { return "/efile/cancel" }

      // Efile Cancel
      public static get EFILE_SEND_TEXT_MESSAGE(): string { return '/plivo/sendTextMessage'}

    // Bank Summary
    public static get BANK_SUMMARY_DETAILS(): string { return "/bank/summary" }

    // get training
    public static get TRAINING_GET(): string { return '/training/get'; }

    //  This function will call API to get rejected return of banks
    public static get GET_BANK_REJECTION_RETURNS(): string { return '/bank/list'; }

    // this function will call API to get DeviceDetail
    public static get GET_DEVICE_DETAIL(): string { return '/printPreview/getDeviceDetail'; }
    //this api will check if custome id is exist or not
    public static get CHECK_CUSTOMERID_DOC_EXISTS(): string { return '/customerId/checkCustomerIdDocExists'; }

    //this api will check if custome id is exist or not
    public static get SAVE_CUSTOMER_ID(): string { return '/customerId/saveCustomerIdDoc'; }

    public static get UPDATE_TERMS_OF_USER(): string { return '/users/updateTermsOfUse'; }

    public static get UPDATE_NEW_FEATURE_FLAG(): string { return '/users/updateNewFeature'; }

    // change return status in case of new status
    public static get RETURN_CHANGE_STATUS(): string { return "/return/changeStatus" };

}