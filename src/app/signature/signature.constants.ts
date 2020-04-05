export class APINAME {
    //GET SIGNATURE AUTHORIZATION LIST
    public static get SIGNATURELIST(): string { return "/signature/authorization/list" };

    //REMOVE DEVICE
    public static get REMOVEDEVICE(): string { return "/signature/authorization/remove" };

    //DEVICE REGISTRATION
    public static get CREATEDEVICEREGISTRATION(): string { return "/signature/authorization/create" };

    //AUTHORIZE DEVICE REGISTRATION
    public static get AUTHORIZEDEVICEREGISTRATION(): string { return "/signature/authorization/approve" };

    //GET DEVICE AUTHORIZATION
    public static get GETDEVICE(): string { return "/signature/authorization/get" };

    //CREATE SIGNATURE
    public static get CREATESIGNATURE(): string { return "/signature/capture/new" };

    //GET CAPTURE AUTHORIZATION
    public static get GETCAPTUREAUTHORIZATION(): string { return "/signature/capture/get" };

    //APPROVE SIGNATURE
    public static get APPROVESIGNATURE(): string { return "/signature/capture/approve" };

    //REMOVE SIGNATURE
    public static get REMOVESIGNATURE(): string { return "/signature/remove" };

    //VIEW ALL SIGNATURE
    public static get SIGNATUREVIEWALL(): string { return "/signature/viewAll" };

}