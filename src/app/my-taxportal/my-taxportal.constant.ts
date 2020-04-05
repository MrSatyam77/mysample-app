export class APINAME {
    // to get efile return list
    public static get GET_SETTING(): string { return '/clientPortal/settings/get'; }

    // Save Client Portal Settings
    public static get SAVE_COMPANY_SETTING(): string { return '/clientPortal/settings/saveCompanyDetails'; }

    // Save Settings
    public static get SAVE_SETTING(): string { return '/clientPortal/settings/save'; }

    // Remove Company Logo
    public static get REMOVE_COMPANY_LOGO(): string { return '/clientPortal/removeLogo'; }

    //Save Questions set
    public static get QUESTIONSET_CREATE(): string { return '/clientPortal/questionSet/create'; }
    //Delete question
    public static get QUESTIONSET_DELETE(): string { return '/clientPortal/deleteQuestionSet'; }
    //Copy question
    public static get QUESTIONSET_COPY(): string { return '/clientPortal/questionSet/copy'; }
    //Get question set
    public static get QUESTIONSET_GET(): string { return '/clientPortal/questionSet/get'; }
    // getAllInvitedClients
    public static get GET_ALL_INVITED_CLIENTS(): string { return '/clientPortal/invitedClient/list'; }

    // Change CLient Status
    public static get CHANGE_CLIENT_STATUS(): string { return '/clientPortal/client/changeStatus'; }

    // Delete Invited Client
    public static get DELETE_INVITED_CLIENT(): string { return '/clientPortal/deleteInvitedClient'; }

    // Resend Invitaion VIA Email
    public static get RESENT_INVITATION_EMAIL(): string { return '/clientPortal/invitation/resend'; }

    // CHANGE SSN
    public static get CHANGE_SSN(): string { return '/clientPortal/change/ssn'; }

    // GET CLIENT PHONE NUMBER
    public static get GET_CLIENT_PHONENUMBER(): string { return '/clientPortal/getClientsPhone'; }

    // Change Date of Link
    public static get CHANGE_LINK_GENERATED_DATE(): string { return '/clientPortal/change/linkGeneratedDate'; }

    // Send SMS
    public static get PLIVO_SEND_TEXT_MESSAGE(): string { return '/plivo/sendTextMessage'; }

    // GET CLIENT LIST
    public static get GET_CLIENT_LIST(): string { return '/clientPortal/client/list'; }

    //update question set
    public static get QUESTIONSET_UPDATE(): string { return '/clientPortal/questionSet/edit'; }

    // DELETE CLIENT
    public static get DELETE_CLIENT(): string { return '/clientPortal/client/delete'; }

    // SAVE CLIENT
    public static get SAVE_CLIENT(): string { return '/clientPortal/client/add'; }

    // DOWNLOAD RETURN DOCUMENT
    public static get RETURN_PDF_DOWNLOAD(): string { return '/clientPortal/returnPdfDownload/'; }

    //DOWNLOAD DOCUMENT BY ID
    public static get DOWNLOAD_DOCUMENT(): string { return '/clientPortal/getUploadedDocument'; }

    // Send Invitation
    public static get SEND_INVITATION(): string { return '/clientPortal/client/sendInvite'; }

    // MARK AS READ
    public static get MARK_AS_READ(): string { return '/clientPortal/request/viewed'; }
}