export class APINAME {
    // get common office and license detail
    public static get OFFICE_OVERVIEW(): string { return "/office/getOfficeDetails" };

    // user list
    public static get USER_LIST(): string { return "/users/list" };

    // office list
    public static get OFFICE_LIST(): string { return "/location/list" };

    // save office detail
    public static get OFFICE_SAVE(): string { return "/location/save" };

    // get office overview details
    public static get GET_CUSTOMER_DETAILS(): string { return "/customer/getCustomerDetails" };

    // save user detail
    public static get SAVE_USER_DETAIL(): string { return "/users/save" };

    // get roles and location list fro user edit screen
    public static get USER_EDIT_LOCATION_ROLE_LIST(): string { return "/location/listForUserCreation" };

    // customer save
    public static get CUSTOMER_SAVE(): string { return "/customer/save" };

    // remove user
    public static get USER_REMOVE(): string { return "/users/remove" };

    // chnage user active status
    public static get USER_CHANGE_STATUS(): string { return "/users/changeStatus" };

    // reset checked out returns
    public static get RESET_OPEN_RETURNS(): string { return "/users/resetcheckedoutreturns" };

    // unlock other user
    public static get UNLOCK_OTHER_USER(): string { return "/users/unlockOtherUser" };

    // verify user mail
    public static get SEND_VERIFY_MAIL(): string { return "/setup/verification/sendMail" };

    //evs verification
    public static get QUESTION_ANSWER_LIST(): string { return "/setup/evs/verification" };

    //verify evs answers
    public static get VERIFY_ANSWERS(): string { return "/setup/evs/verifyAnswers" }

    // verify mail code
    public static get VALIDATE_MAIL_VERIFY_CODE(): string { return "/setup/verification/verifyMail" };

    // send phone verification code
    public static get SEND_PHONE_VERIFY_MESSAGE(): string { return "/setup/send/textMessage" };

    // verify mail code
    public static get VALIDATE_PHONE_VERIFY_CODE(): string { return "/setup/verifyPhone" };

    // remove location
    public static get REMOVE_LOCATION(): string { return "/location/remove" };

    // chnage password for other user
    public static get CHANGE_OTHER_USER_PASSWORD(): string { return "/users/changeOtherUserPassword" };

    // create new user
    public static get CREATE_USER(): string { return "/users/create" };

    // create new location
    public static get CREATE_OFFICE(): string { return "/location/create" };

    // upload user profile image
    public static get UPLOAD_USER_IMAGE(): string { return "/users/uploadProfile" };

    // get particular user detail
    public static get USER_OPEN(): string { return "/users/open" };

    // get migration messages
    public static get MIGRATION_MESSAGES_VIEW(): string { return "/customer/migrationMessages/view" };

    // mark migratio message as read
    public static get MARK_MESSAGE_AS_READ(): string { return "/customer/migrationMessages/markAsRead" };

    // save efin detail
    public static get EFIN_SAVE(): string { return "/efin/save" };

    // get efin list
    public static get EFIN_LIST(): string { return "/efin/get" };

    // mark office aert as read
    public static get MARK_NEW_OFFICE_ALERT(): string { return "/users/showNewOfficeAlert" };

    // get signature image
    public static get GET_SIGNATURE_IMAGE(): string { return "/signature/getSignatureById" };


    public static get LIST_FOR_CHANGE_LOCATION(): string { return "/location/listForChangeLocation" };

    // get location data
    public static get GET_LOCATION_DETAIL(): string { return "/location/open" };

    // to delete efin
    public static get REMOVE_EFIN(): string { return "/efin/remove" };
}