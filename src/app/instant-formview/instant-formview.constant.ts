export class APINAME {
    // get authorize device list
    public static get getAuthorizeDeviceList(): string { return "/printPreview/getDeviceList" };

    // authorize device
    public static get authorizeDevice(): string { return "/printPreview/authorize/device" };

    // get pin number
    public static get getPinNumber(): string { return "/printPreview/generatePIN" };

    // delete trusted device
    public static get deleteTrustedDevice(): string { return "/printPreview/deleteTrustedDevices" };
}