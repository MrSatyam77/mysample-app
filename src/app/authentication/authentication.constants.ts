export class APINAME {
    // session cal
    public static get AUTH_SESSION(): string { return "/auth/session" };

    // login api call
    public static get AUTH_LOGIN(): string { return "/auth/login" };

    // verify two factor authentication
    public static get AUTH_VERIFY_TWOFACTOR(): string { return "/auth/twoFactor/verifyCode" };

    // resend two factor authentication code
    public static get AUTH_RESEND_TWOFACTOR_CODE(): string { return "/auth/twoFactor/resendCode" };

    // overwrite session
    public static get OVERWRITE_SESSION(): string { return "/auth/overwriteSession" };

    // logout
    public static get AUTH_LOGOUT(): string { return "/auth/logout" };

    // registration
    public static get AUTH_REGISTRATION(): string { return "/auth/registration" };

    // verify registration
    public static get AUTH_VERIFY_REGISTRATION(): string { return "/auth/verifyRegRequest" };

    // confirm registration 
    public static get AUTH_CONFIRM_REGISTRATION(): string { return "/auth/verification" };

    // resend registration mail
    public static get AUTH_RESEND_REGISTRATION_MAIL(): string { return '/auth/resend' };

    // cerate demo user
    public static get AUTH_CREATE_DEMO_USER(): string { return '/auth/createDemoUser' };

    // forgot password /auth/forgotPassword
    public static get AUTH_FORGOT_PASSWORD(): string { return "/auth/forgotPassword" };

    // verify forgot password key'/auth/verifyFpRequest'
    public static get AUTH_VERIFY_FORGOT_PASSWORD(): string { return '/auth/verifyFpRequest' };

    // reset passeord
    public static get AUTH_RESET_PASSWORD(): string { return '/auth/resetPassword' };

    // verify unlock account request
    public static get AUTH_VERIFY_UNLOCK(): string { return '/auth/verifyUnlockRequest' };

    // resend unlock account mail
    public static get AUTH_RESEND_UNLOCK_MAIL(): string { return '/auth/resendUnlockAccountEmail' };

    // send demo account info
    public static get AUTH_SEND_DEMO_INFO(): string { return '/auth/sendDemoAccountInfo' };

    //  HEALTH CHECK api
    public static get GET_HEALTH_CHECK(): string { return '/health/check'; }

    // mark browser support
    public static get POST_MARK_SUPPORT(): string { return '/auth/browser/markSupport'; }

    // navigator user instruction leave message
    public static get GET_SIDEBAR_DETAILS(): string { return "/software/getSideMenuConfiguration" }

    // verify key
    public static get VERIFY_KEY(): string { return '/auth/verifyFpRequest'; }

    // get Quick Tips Data
    public static get GET_QUICK_TIPS(): string { return '/tips/get'; }

    // get News Data
    public static get GET_NEWS(): string { return '/news/get'; }

    //  Change Password
    public static get CHANGE_PASSWORD(): string { return '/auth/changePassword'; }
}