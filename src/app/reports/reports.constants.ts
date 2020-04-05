export class APINAME {
    // view report
    public static get VIEW_REPORT(): string { return "/report/view/new" };

    // get report list
    public static get GET_REPORT_LIST(): string { return "/report/list" };

    //get specific report data by id
    public static get GETREPORTBYID(): string { return "/report/open" };

    //save Report data by id
    public static get SAVEREPORT(): string { return "/report/custom/create" };

    //update Report data by id
    public static get UPDATEREPORT(): string { return "/report/custom/update" };

    //get report list
    public static get GETREPORTLIST(): string { return "/report/list" };

    //get report list
    public static get GETFIELDLIST(): string { return "/report/custom/field/list"
    }
}