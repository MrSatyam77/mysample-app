export class APINAME {
    // to get efile return list
    public static get GET_CONVERSION_LIST(): string { return '/conversion/getAllConversionJobDetail'; }
    /** Before upload */
    public static get BEFOREUPLOAD(): string { return '/conversion/beforeUpload'; }
    /** Before upload */
    public static get UPDATEFILE_LIST(): string { return '/conversion/updateFileList'; }
    /** Verify filelist */
    public static get VERIFYFILE_LIST(): string { return '/conversion/verifyConversionReq'; }
    /** Verify filelist */
    public static get UPDATE_CUSTOMER_DECISION(): string { return '/conversion/customerDecision'; }
    /** get detail of selected conversion */
    public static get GET_CONVERSION_DETAIL_LIST(): string { return '/conversion/getConversionDetail'; }
    /** get detail of selected conversion */
    public static get CANCEL_UPLOAD(): string { return '/conversion/cancelUpload'; }
}
/** Display format in page */
export enum DEFAULT_FORMAT {
    DATE = "MM/DD/YYYY"
}