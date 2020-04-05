export class APINAME {

    // to get return List
    public static get RETURN_LIST(): string { return '/return/list' }

    //   get state rejected returns
    public static get GET_REJECT_RETURNS(): string { return '/efile/list'; }

    //  This function will call API to get rejected return of banks
    public static get GET_BANK_REJECTION_RETURNS(): string { return '/bank/list'; }

    // Call bank status api
    public static get GET_BANK_PRODUCT(): string { return '/bank/getStatus'; }

    // to add sample returns
    public static get ADD_SAMPLE_RETURNS(): string { return '/return/addSampleReturns'; }

    // get dashboard settings user wise
    public static get GET_USER_DASHBOARD_SETTINGS(): string { return '/dashboard/setting/get'; }

    // Save user dashboard settings
    public static get SAVE_USER_DASHBOARD_SETTINGS(): string { return '/dashboard/setting/update'; }

    // Reset Dashboard Settings
    public static get RESET_USER_DASHBOARD_SETTINGS(): string { return '/dashboard/setting/restore'; }

    // to calender list on base of date
    public static get CALENDER_LISTBYDATE(): string { return '/calendar/listByDate'; }

    // to get efile return list
    public static get GET_EFILE_SUMMARY(): string { return '/efile/summary'; }

    // NEWS WIDGETS
    public static get NEWS_GET(): string { return '/news/get'; }

     //get efile data
     public static get GET_EFILE_OPEN(): string { return '/efile/open' ;}
}
