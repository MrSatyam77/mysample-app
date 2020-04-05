// External Imports
import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    // holds current displayed toasts
    public currentToasts: Array<any> = [];

    // holds message type class
    private typeClass: { success: string, error: string, info: string } = {
        success: 'bg-success text-light',
        error: 'bg-danger text-light',
        info: 'bg-info text-light'
    }

    // default toast options for server error.
    private defaultOptions: { type: string, message: string } = { type: "error", message: "Error while processing your request." };

    // emits value to toast conatiner when new toast added.
    public toastSubscription = new Subject();

    // default messages
    private defaultMessages: Array<any> = [
        { key: 'DAPI_4000', type: 'error', en: '' },//Already handled by registration controller
        { key: 'DAPI_4001', type: 'error', extraWidth: true, en: "E-mail address and Password doesn't match (Code: 4001)<br />Is your Caps Lock on? Please verify your e-mail address and password. Use the <b>Forgot Password</b> option to reset your password." },
        { key: 'DAPI_4002', type: 'error', extraWidth: true, en: 'Browser Connection (Code: 4002)<br />The connection with your browser failed. Please <b>log out, close</b> your <b>browser</b> and try again. If the issue persists, please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4002. If possible, please have TeamViewer ready to show the Support Representative the action you took when you received the error.' },
        { key: 'DAPI_4004', type: 'error', extraWidth: true, en: 'Unauthorized Access (Code: 4004)<br />You do not have privileges to complete the action you are performing. If the issue persists, please <b>contact</b> your MyTAXPrepOffice <b>Admin</b> or the <b>Support Team</b> and mention Error Code: 4004. If possible, please have TeamViewer ready to show the Support Representative the action you took when you received the error.' },
        { key: 'DAPI_4005', type: 'error', en: '' },/*Invalid CSRF Token*/
        { key: 'DAPI_4006', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4006)<br />Please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4006. Please provide them the e-mail address you are trying to use to log in.' },
        { key: 'DAPI_4007', type: 'error', extraWidth: true, en: 'Return Locked for Editing (Code: 4007)<br />Another user has this return open. If you are an Admin, from the <b>Dashboard</b>, click on <b>User</b> and select "Reset open returns to editing" from the Actions drop-down menu.' },
        { key: 'DAPI_4008', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4008)<br />The link you used has expired or is invalid. Please click on the <b>Forgot Password</b> option from the <b>Log In</b> screen to request a new link.' },
        { key: 'DAPI_4009', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4009)<br />The link you used has expired. Please click on the <b>Forgot Password</b>. option from the <b>Log In</b> screen to request a new link. If the issue persists, please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4009.' },
        { key: 'DAPI_4010', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4010)<br />This EIN already exists in your EIN Library. From the <b>Dashboard</b>, select <b>EIN Library</b> from the <b>ToolBox</b> widget to view/edit your EIN List. ' },
        { key: 'DAPI_4011', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4011)<br />This Preparer ID already exists in your Preparer List. From the <b>Dashboard</b>, select <b>Preparer</b> from the <b>Your Firm</b> widget to view/edit your Preparer List. ' },
        { key: 'DAPI_4012', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4012)<br />This tax return has already been Accepted. To view the e-File status, please use the <b>Quick Return Summary</b> from the <b>Dashboard</b> or the return workspace.' },
        { key: 'DAPI_4013', type: 'error', extraWidth: true, en: 'Incorrect Password (Code: 4013)<br />Is your Caps Lock on? Please verify that you are entering the correct Old Password. The <b>New Password</b> must match the <b>Confirm Password</b> field.' },//Change Passwored
        { key: 'DAPI_4014', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4014)<br />Please enter your <b>EFIN</b> in the <b>Quick Office Setup</b> screen or use the <b>Office</b> option from the <b>Your Firm</b> widget on the <b>Dashboard</b>. If your EFIN is listed, please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4014.' },
        { key: 'DAPI_4015', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4015)<br />Your ERO Enrollment is already completed for the current tax year. If you feel you received this message in error, please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4015.' },
        { key: 'DAPI_4016', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4016)<br />Please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4016. If possible, please have TeamViewer ready to show the Support Representative the ERO Enrollment Application that you are trying to edit.' },
        { key: 'DAPI_4017', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4017)<br />This return is currently in the <b>Transmitted</b> or <b>At the IRS/State</b> queue. If the return is in the <b>Transmitted</b> queue, <b>Cancel the e-File</b> before you Select <b>Delete Return</b> from the Actions drop-down menu in the Return List. If the return is At the IRS/State, you will need to wait for the acknowledgment before you can delete this return.' },
        { key: 'DAPI_4018', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4018)<br />The return is <b>locked</b>. You cannot <b>save</b> changes or update the return <b>status.</b> Please <b>unlock</b> the return before making changes. If the issue persists, please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4018.' },
        { key: 'DAPI_4022', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4022)<br />The <b>User</b> credentials you are using to log in have been <b>deactivated.</b> Please <b>contact</b> your MyTAXPrepOffice <b>Admin</b> to <b>activate</b> your account.' },
        { key: 'DAPI_4028', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 4028)<br />You are trying to upload a duplicate zipped file for a <b>Conversion</b> request that has already been processed successfully.' },
        { key: 'DAPI_4029', type: 'error', extraWidth: true, en: "Error Processing your Request (Code: 4029)<br />This return includes a taxpayer's bank application, but your ERO Enrollment is not completed. Please complete your <b>ERO Enrollment Application</b> from the <b>Financial Products</b> widget on the <b>Dashboard.</b>" },
        { key: 'DAPI_4030', type: 'error', extraWidth: true, en: "Error Processing your Request (Code: 4030)<br />This return includes a taxpayer's <b>Navigator</b> bank application, but your ERO Enrollment is not completed. Please complete your <b>Navigator ERO Enrollment Application</b> from the <b>Financial Products</b> widget on the <b>Dashboard.</b>" },
        { key: 'DAPI_4031', type: 'error', extraWidth: true, en: "Error Processing your Request (Code: 4031)<br />Please <b>contact</b> our <b>Support Team</b> and mention Error Code: 4031. Please provide them the e-mail address you are using to complete this return with a <b>Navigator</b> taxpayer's <b>bank application.</b>" },
        { key: 'DAPI_4032', type: 'error', extraWidth: true, en: "Error Processing your Request (Code: 4032)<br />The return you are trying to access does not exist in this office. If you feel you received this message in error, <b>contact</b> our <b>Support Team</b> and mention Error Code: 4032. Please provide them the return's SSN/EIN." },
        { key: 'DAPI_2002', type: 'success', en: '' },/*Session Created*/
        { key: 'DAPI_2003', type: 'success', en: '' },//Login. Already showing this message at controller end
        { key: 'DAPI_5000', type: 'error', extraWidth: true, en: 'Authentication Error (Code: 5000)<br />Please <b>verify</b> your <b>e-mail</b> address. If the e-mail address is correct, please <b>contact</b> our <b>Support Team</b>.' },
        { key: 'DAPI_5001', type: 'error', extraWidth: true, en: 'User Creation Error (Code: 5001)<br />Please <b>verify</b> the <b>e-mail</b> address for this <b>User</b>.  The e-mail address is not valid.' },
        { key: 'DAPI_5002', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 5002)<br />Please <b>contact</b> our <b>Support Team</b> or <b>send the return to Support</b> from the <b>Tools</b> menu and mention Error Code: 5002. Please include a brief description of the action you took in the return when you received the error.' },
        { key: 'DAPI_5011', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 5011)<br />Unable to process your print request. Please wait for a moment and try again. If the error persists, please <b>contact</b> our <b>Support Team</b> or <b>send the return to Support</b> from the <b>Tools</b> menu and mention Error Code 5011.' },
        { key: 'DAPI_5012', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 5012)<br />This form is currently not available for printing. Please <b>contact</b> our <b>Support Team</b> or <b>send the return to Support</b> from the <b>Tools</b> menu and mention Error Code: 5012. Please include the Form Number/Name you were trying to print when you received the error.' },
        { key: 'DAPI_5019', type: 'error', extraWidth: true, en: 'Error Processing your Request (Code: 5019)<br />This form is currently not available for printing. Please <b>send the return to Support</b> from the <b>Tools</b> menu and mention Error Code: 5019. Please include the Form Number/Name you were trying to print when you received the error.' },
        { key: 'DAPI_4038', type: 'error', en: 'There is something wrong with reCAPTCHA (Error code: 4038)' },//Invalid captcha
        { key: 'DAPI_2008', type: 'error', en: 'Recalculate your return from tools menu (Error code: 2008)' },
        { key: 'DAPI_4039', type: 'error', en: '' },
        { key: 'DAPI_4070', type: 'error', en: 'An invitation has been sent to this email by another preparer.' },
        { key: 'DAPI_4071', type: 'error', en: 'This client is associated with another SSN.' },
        { key: 'DAPI_4072', type: 'error', en: 'Client has already accepted the invitation.' },
        { key: 'DAPI_4073', type: 'error', en: 'The preparer has modified this return. You will receive a new copy of the return for your signature.' },
        { key: 'DAPI_4074', type: 'error', en: 'This SSN is associated with another client.' }
    ];

    /**
     * @author Heena Bhesaniya
     * @description This method is used to displaying message
     * @param defaultMessage meesage text that need to be displayed in toaster
     * @param messageType message type  success/error/info
     * @param messageKey defalut message key
     * @param duration time duration in miliseconds
     */
    public showMessage(message?: string, type?: string, messageKey?: string, duration: number = 5000): void {
        if (messageKey) {
            let relatedMessage = this.defaultMessages.find((obj: any) => { return obj.key === messageKey });
            if (relatedMessage) {
                message = relatedMessage.en;
                type = relatedMessage.type;
            } else if (messageKey.indexOf("DAPI_5") > 0 || messageKey.indexOf("DAPI_4") > 0) {
                message = this.defaultOptions.message;
                type = this.defaultOptions.type + ' (Error Code: ' + messageKey.substring(5) + ')';
            }
        }

        if (message) {
            this.currentToasts.push({ message: message, type: this.typeClass[type], duration: duration, id: this.generateUniqueId() });
            this.toastSubscription.next(this.currentToasts);
        }
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to generate unique number to assigned to each toast.
     */
    private generateUniqueId(): number {
        const uuid = Math.floor(Math.random() * 1000 + 1);
        let sameIdExists = this.currentToasts.find(obj => {
            return obj.id === uuid;
        });
        if (sameIdExists) {
            this.generateUniqueId();
        } else {
            return uuid;
        }
    }

    /**
     * @author Heena Bhesaniya
     * @description Remove toaster message
     * @param toast 
     */
    public hideMessage(id: number): void {
        this.currentToasts = this.currentToasts.filter(t => t.id !== id);
        this.toastSubscription.next(this.currentToasts);
    }

    //to clear all toaster
    public clear (): void {
        this.currentToasts = [];
        this.toastSubscription.next(this.currentToasts);
    }

}
