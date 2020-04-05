// External Imports
import { Injectable } from "@angular/core";

// Internal Imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { UtilityService } from "@app/shared/services/utility.service";
import { APINAME } from '@app/office/office.constants';
import { officeDetail, userDetail, efinDetail } from "@app/office/office";
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})

export class OfficeService {
    private locationDetails: { officeList: Array<any>, userList: Array<any> } = { officeList: [], userList: [] };

    constructor(
        private _commonAPIService: CommonAPIService,
        private _utilityService: UtilityService) { }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to call API to get customer detail to get owner info, contact detail and admin info and service beuro info.
     */
    public getCustomerDetails() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GET_CUSTOMER_DETAILS
            }).then((result) => {
                result.data.administartor = result.data.administartor ? result.data.administartor : {};
                result.data.serviceBureau = result.data.serviceBureau ? result.data.serviceBureau : {};
                result.data.contractContact = result.data.contractContact ? result.data.contractContact : {};
                result.data.licenseOwner = result.data.licenseOwner ? result.data.licenseOwner : {};
                result.data.roleModel = result.data.roleModel ? result.data.roleModel : 3;
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @description
     *          THis function is used to call API to get list of users.
     */
    public getUserListFromAPI() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_LIST,
                parameterObject: {}
            }).then((userList) => {
                // filter admin users
                let adminUsers = [];
                // filter contract contact
                let contractContact = [];

                userList.data.forEach(element => {
                    element = this.prepareUserObj(element);
                });
                // sort by full name
                this.locationDetails.userList = this.sortUserListOnActiveAndName(userList.data);
                // admin users
                adminUsers = this.locationDetails.userList.filter((obj) => { return obj.isAdministrator === true });
                // contract contacts
                contractContact = this.locationDetails.userList.filter((obj) => { return obj.isContractContact === true });
                resolve({ userList: this.locationDetails.userList, adminUserList: adminUsers, contractContacts: contractContact });
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to call api to get particular user detail
     */
    public getUserDetail(userId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_OPEN,
                parameterObject: { userId: userId }
            }).then((result) => {
                resolve(this.prepareUserObj(result.data));
            }, (error) => {
                reject(error);
            })
        })
    }

    // This function is used to prepare user object comes from api.
    private prepareUserObj(userObj: any): any {
        // full name
        userObj.fullName = userObj.firstName + userObj.lastName;
        // to set user type field
        if (userObj.userType && userObj.userType.length > 0) {
            if (userObj.userType.indexOf(1) >= 0) {
                userObj.isPreparer = true;
            }
            if (userObj.userType.indexOf(2) >= 0) {
                userObj.isERO = true;
            }
        }

        // set two factor auth object here to prevent error by front end side
        if (!userObj.twoFactorAuthentication) {
            userObj.twoFactorAuthentication = {};
        }

        // set preparerId in edit mode if not exist.
        if (!userObj.preparerId) {
            userObj.preparerId = userObj.firstName.substring(0, 2) + userObj.lastName.substring(0, 2);
        }

        // set efiling state based fields
        if (userObj.isPreparer === true && userObj.efilingStates && userObj.efilingStates.length > 0) {
            if (userObj.efilingStates.indexOf("NY") >= 0) {
                userObj.isNYEfileState = true;
            }

            if (userObj.efilingStates.indexOf("NM") >= 0) {
                userObj.isNMEfileState = true;
            }

            if (userObj.efilingStates.indexOf("OR") >= 0) {
                userObj.isOREfileState = true;
            }
        }
        // set profile pic image
        if (userObj.profilePhoto) {
            userObj.userImageSrc = environment.base_url + "/profilePic/" + userObj.profilePhoto;
        } else {
            userObj.userImageSrc = "assets/images/user-icon-01.png";
        }
        return userObj;
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to sort user list based on active status and firstname, lastname combination.
     */
    private sortUserListOnActiveAndName(userList: Array<any>): Array<any> {
        let activeUsers = userList.filter((user) => { return user.isActiveUser === true });
        let inactiveUsers = userList.filter((user) => { return !user.isActiveUser });
        let sortedActiveUsers = this._utilityService.sortByProperty(activeUsers, "fullName");
        let sortedInactiveUsers = this._utilityService.sortByProperty(inactiveUsers, "fullName");
        return sortedActiveUsers.concat(sortedInactiveUsers);
    }

    /**
     * @author Hannan Desai
     * @description 
     *          This function is used to call api get efin list fall under location from api.
     */
    public getEFINListFromAPI() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.EFIN_LIST
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // save efin deatil
    public saveEFINDetail(efinDetail: efinDetail) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.EFIN_SAVE,
                parameterObject: efinDetail
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to call api to get list of available offices.
     */
    public getOfficeListFromAPI() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.OFFICE_LIST,
                parameterObject: { location: true }
            }).then((officeList) => {
                // to set selected address property and set udefined property
                officeList.data.forEach(element => {
                    element.address = {};
                    element.addressType = element.addressType ? element.addressType : 1;
                    element.name = element.name ? element.name : "";
                    element.contactFirstName = element.contactFirstName ? element.contactFirstName : "";
                    element.contactLastName = element.contactLastName ? element.contactLastName : "";
                    let addressPropName = element.addressType === 2 ? "foreignAddress" : "usAddress";
                    let zipPropName = element.addressType === 2 ? "postalCode" : "zipCode";
                    element.address.street = element[addressPropName] && element[addressPropName].street ? element[addressPropName].street : "";
                    element.address.zipCode = element[addressPropName] && element[addressPropName][zipPropName] ? element[addressPropName][zipPropName] : "";
                    element.address.city = element[addressPropName] && element[addressPropName].city ? element[addressPropName].city : "";
                    element.address.state = element[addressPropName] && element[addressPropName].state ? element[addressPropName].state : "";
                    element.address.telephone = element[addressPropName] && element[addressPropName].telephone ? element[addressPropName].telephone : "";
                    element.address.country = element[addressPropName] && element[addressPropName].country ? element[addressPropName].country : "";
                });
                // sort by office name
                this.locationDetails.officeList = this._utilityService.sortByProperty(officeList.data, "name");
                resolve(this.locationDetails.officeList);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @param officeDetail 
     *          Holds office obj to store,
     * @description
     *          This function is used to call api to save office data.
     */
    public saveOfficeDetail(officeDetail: officeDetail, newOffice?: boolean) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: newOffice === true ? APINAME.CREATE_OFFICE : APINAME.OFFICE_SAVE,
                parameterObject: { location: officeDetail }
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @param userDetail 
     *          Holds user obj to save.
     * @description
     *          User to call api to save user detail.
     */
    public updateUserDetail(userDetail: userDetail) {
        const self = this;
        return new Promise((resolve, reject) => {
            self._commonAPIService.getPromiseResponse({
                apiName: APINAME.SAVE_USER_DETAIL,
                parameterObject: { update: userDetail }
            }).then((result) => {
                resolve(true);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @param userDetail 
     *          Holds new user detail 
     * @description
     *          This function is used to call api to create new user.
     */
    public createNewUser(userDetail: userDetail) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.CREATE_USER,
                parameterObject: { registration: userDetail }
            }).then((result) => {
                resolve(true);
            }, (error) => {
                reject(error);
            })
        })
    }

    public getLocationAndRoleList() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_EDIT_LOCATION_ROLE_LIST
            }).then((result) => {
                // sort location list by name property
                if (result.data.locationsData && result.data.locationsData.length > 1) {
                    result.data.locationsData = this._utilityService.sortByProperty(result.data.locationsData, "locationName");
                }
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // to call api that save customer detail
    public saveCustomerDetail(data: any) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.CUSTOMER_SAVE,
                parameterObject: data
            }).then((result) => {
                resolve(true);
            }, (error) => {
                reject(error);
            })
        })
    }

    // call API to remove user
    public removeUser(users: Array<string>) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_REMOVE,
                parameterObject: { 'userIds': users }
            }).then((result) => {
                resolve(true);
            }, (error) => {
                reject(error);
            })
        })
    }

    // call api to chnage user active status
    public changeUserActiveStatus(users: Array<string>, status: boolean) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_CHANGE_STATUS,
                parameterObject: {
                    user: {
                        keys: users,
                        isActiveUser: status
                    }
                }
            }).then((result) => {
                resolve(true);
            }, (error) => {
                reject(error);
            })
        })
    }

    // reset open returns for editing
    public resetOpenReturns(userId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.RESET_OPEN_RETURNS,
                parameterObject: { userid: userId }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // unlock other user
    public unlockOtherUser(email: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.UNLOCK_OTHER_USER,
                parameterObject: { data: { 'emailToUnlock': email } }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // to send mail verification code to email id to verify mail id.
    public sendMailForEmailVerify(email: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.SEND_VERIFY_MAIL,
                parameterObject: {
                    mail: email
                }
            }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error);
            })
        })
    }

    // to get active user count
    public getActiveUserCount() {
        return this.locationDetails.userList.filter((obj) => { return obj.isActiveUser === true }).length;
    }

    // to get contract contacts count
    public getContractContactsCount() {
        return this.locationDetails.userList.filter((obj) => { return obj.isContractContact === true }).length;
    }

    // filter user and return filtered data based on active flag
    public filterActiveUser(active: boolean, searchTerm: string) {
        let filteredActiveUsers;
        let filteredUsers;
        if (active === true) {
            filteredActiveUsers = this.locationDetails.userList.filter((user) => { return user.isActiveUser === true })
        } else if (active === false) {
            filteredActiveUsers = this.locationDetails.userList.filter((user) => { return !user.isActiveUser });
        } else {
            filteredActiveUsers = this.locationDetails.userList;
        }

        filteredUsers = filteredActiveUsers.filter((user) => {
            if (user.firstName && user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                return true;
            } else if (user.lastName && user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                return true;
            } else if (user.email && user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                return true;
            } else if (user.phoneNo && user.phoneNo.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                return true;
            }
        })
        return filteredUsers;
    }

    public getQuestionsAnswersList(userInfo: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            self._commonAPIService.getPromiseResponse({
                apiName: APINAME.QUESTION_ANSWER_LIST,
                parameterObject: userInfo,
                methodType: "post"
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }

    // api call for verification of Answers
    verificationQuestionAnswers(questionsAnswersList, questionsId, count, nextAttemptPossible, efin) {
        const self = this;
        return new Promise((resolve, reject) => {
            self._commonAPIService.getPromiseResponse({
                apiName: APINAME.VERIFY_ANSWERS,
                methodType: "post",
                parameterObject: { 'evsAnswerData': questionsAnswersList, 'id': questionsId, 'nextAttemptPossible': nextAttemptPossible, 'count': count, 'efin': efin }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // validate code entered by user fro mail verification
    public validateCodeForMail(otpDocKey: string, code: string, userId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.VALIDATE_MAIL_VERIFY_CODE,
                parameterObject: {
                    id: otpDocKey,
                    verificationCode: code,
                    userId: userId
                }
            }).then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }

    // to send message to user phone no with code in order to verify phone no.
    public sendMessageForPhoneVerify(phone: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.SEND_PHONE_VERIFY_MESSAGE,
                parameterObject: {
                    phone: phone,
                }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // validate code entered bu user for phone verification
    public validatCodeForPhone(otpDocKey: string, code: string, userId: string, phone: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.VALIDATE_PHONE_VERIFY_CODE,
                parameterObject: {
                    id: otpDocKey,
                    code: code,
                    phone: phone,
                    userId: userId
                }
            }).then((result) => {
                resolve(result)
            }, (error) => {
                reject(error);
            })
        })
    }

    // call api to remove user location
    public removeLocation(locationIds: Array<string>) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.REMOVE_LOCATION,
                parameterObject: {
                    locationIds: locationIds
                }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // call api to chnage other user passowrd.
    public changeOtherUserPassword(email: string, passowrd: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.CHANGE_OTHER_USER_PASSWORD,
                parameterObject: {
                    data: { emailForChangePassword: email, newPassword: passowrd }
                }
            }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error);
            })
        })
    }

    // to upload profile image of user
    public uploadProfileImage(fileName: string, image: string, userId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.UPLOAD_USER_IMAGE,
                parameterObject: { image: image, fileName: fileName, userId: userId }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // to get user doc migration mesages fro user
    public getMigrationMessages() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.MIGRATION_MESSAGES_VIEW
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // call api to mark migration message as read
    public markAsReadMessage(id: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.MARK_MESSAGE_AS_READ,
                parameterObject: {
                    id: id,
                    deviceInformation: this._utilityService.getDeviceInformation()
                }
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // to mark new office alert message as read
    public markNewOfficeAlertAsRead() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.MARK_NEW_OFFICE_ALERT
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    // get singature image from api
    public getSignatureImage(id: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GET_SIGNATURE_IMAGE,
                parameterObject: { id: id }
            }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error)
            })
        })
    }

    /**
     * @author Ravi Shah
     * Get Assigned Location List of the Users
     * @returns
     * @memberof OfficeService
     */
    public getAssignedLocationList() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({ apiName: APINAME.LIST_FOR_CHANGE_LOCATION }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error)
            })
        })
    }

    /**
     * @author Asrar Memon
     * Get Assigned Location List of the Users
     * @returns
     * @memberof OfficeService
     */
    public getLocation(locationId) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GET_LOCATION_DETAIL,
                parameterObject: { locationId: locationId }
            }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error)
            })
        })
    }

    /**
     * @author Hannan Desai
     * @param efinId 
     *          Holds efinId to be deleted.
     * @description
     *          This function is used to call api to remove efin from list.
     */
    public removeEFIN(efinId: string, efin: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.REMOVE_EFIN,
                parameterObject: { id: efinId, efin: efin }
            }).then((result) => {
                resolve(result.data)
            }, (error) => {
                reject(error);
            })
        })
    }
}