export class APINAME {
    //Create restore return list 
    public static get createRestoreReturn(): string { return "/return/restoreReturn/create" };

    // return list
    public static get RETURN_LIST(): string { return "/return/list" };

    // get prior year return list
    public static get PRIORYEAR_RETURN_LIST(): string { return "/priorYearReturn/list" };

    // prior year return check
    public static get PRIORYEAR_RETURN_CHECK(): string { return "/return/priorYearCheck" };

    // proforma on new return
    public static get PROFORMA_NEW_RETURN(): string { return "/newReturn/proforma" };

    // quick return summary
    public static get RETURN_SUMMARY(): string { return "/return/summary" };

    // create return
    public static get CREATE_RETURN(): string { return "/return/create" };

    // open return
    public static get OPEN_RETURN(): string { return "/return/open" };

    // create return
    public static get CLOSE_RETURN(): string { return "/return/close" };

    // save return
    public static get SAVE_RETURN(): string { return "/return/save" };

    // save return
    public static get BACKUP_RETURN(): string { return "/return/backup" };

    // save return
    public static get PROFORMA_RETURN(): string { return "/return/proforma" };

    // save return
    public static get RETURN_CHANGE_STATUS(): string { return "/return/changeStatus" };

    // delete return
    public static get DELETE_RETURN(): string { return "/return/remove" };

    // add sample return
    public static get ADD_SAMPLE_RETURN(): string { return "/return/addSampleReturns" };

    // create efile
    public static get CREATE_EFILE(): string { return "/efile/create" };

    // manage default return
    public static get MANAGE_DEFAULT_RETURN(): string { return "/return/manageDefaultReturn" };

    // get deafult tax return
    public static get GET_DEFAULT_RETURN(): string { return "/return/getTaxReturn" };

    // get list of available k1 data
    public static get GET_LIST_K1(): string { return "/return/getListOfK1Data" };

    // get list of available k1 data
    public static get GET_RETURN_K1DATA(): string { return "/return/getK1DataFromReturn" };

    // create copy of return
    public static get CREATE_DUPLICATE_RETURN(): string { return "/return/create/duplicate" };
}