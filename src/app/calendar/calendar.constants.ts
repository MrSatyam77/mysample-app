export class APINAME {
    // to get Event list
    public static get GET_EVENT_LIST(): string { return '/calendar/list'; }
    // to get Event list
    public static get SAVE_EVENT(): string { return '/calendar/save'; }
    // user list value 
    public static get CREATE_APPOINTMENT(): string { return "/calendar/create" };
    // Open Calendar
    public static get OPEN_APPOINTMENT(): string { return "/calendar/open" };
    //remove appointment
    public static get REMOVE_APPOINTMENT(): string { return "/calendar/remove" };
    // user list value 
    public static get USERS_LIST(): string { return "/users/list" };
    // user list value 
    public static get RECENT_RETURN_LIST(): string { return "/return/list" };

}