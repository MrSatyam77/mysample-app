export class APINAME {
     // Privileges List Verification
     public static get PRIVILEGES_LIST_VERIFICATION(): string { return "/privileges/listForVerification" };
    
     // Privileges List  
     public static get PRIVILEGES_LIST(): string { return "/privileges/list" };
     
     // get role list
     public static get ROLES_LIST(): string { return "/roles/list" };
     
     // role create
     public static get ROLES_CREATE(): string { return "/roles/create" };
     
     // role save
     public static get ROLES_SAVE(): string { return "/roles/save" };
     
     // role open
     public static get ROLES_OPEN(): string { return "/roles/open" };
     
     // role remove
     public static get ROLES_REMOVE(): string { return "/roles/remove" };
}
