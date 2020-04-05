// External Imports
import { Injectable } from '@angular/core';

// Internal imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/shared/shared.constants';
@Injectable({
    providedIn: 'root'
})

export class IntroService {
    public allModuleSteps = {
        return: {
            edit: {
                steps: [
                    {
                        element: '#step1',
                        position: 'right',
                        intro: 'To add any desired form, click on the \"Add Form \" button. Then, search for the form you need to prepare. You can search by form name or keywords like \'credit\'.'
                    },
                    {
                        element: '#step2',
                        position: 'right',
                        intro: 'Use the Quick Forms to add the most common forms entered into a tax return.'
                    },
                    {
                        element: '#step3',
                        position: 'right',
                        intro: 'The federal forms list in the forms navigator contains all the forms in your clients federal return.'
                    },
                    {
                        element: '#step4',
                        position: 'right',
                        intro: 'To delete a form from the return, locate the form in the Form Tree (or use the search box). Hover your mouse or click on the form you want to delete to access the forms context menu (vertical ellipsis or three dots) which allows you to print the form, print a blank form, or delete the form.'
                    },
                    {
                        element: '#step5',
                        position: 'right',
                        intro: 'If you want to find a form, in your clients return, type the name of the form into the search box and press enter. To clear the search, select the text, delete it, and press enter or use the backspace key in your keyboard.'
                    },
                    {
                        element: '#step6',
                        position: 'right',
                        intro: 'To add a state return, click on the \'+ Add state \' button. Select the desire state by clicking the appropriate checkbox and then, click on the corresponding residency button.'
                    },
                    {
                        element: '#step7',
                        position: 'right',
                        intro: 'Click these bars to open and close the left and right panes.'
                    },
                    {
                        element: '#step8',
                        position: 'right',
                        intro: 'The Save button is multi-purpose. When you are preparing returns, it \'Saves\' your data entries. When a return is transmitted to the IRS and/or states it is automatically locked, use this button to \'Unlock\' the return for editing.'
                    },
                    {
                        element: '#step9',
                        position: 'right',
                        intro: 'The Tools menu is where you can manually Recalculate the return or access the Asset and Vehicle Depreciation input grids.'
                    },
                    {
                        element: '#step10',
                        position: 'right',
                        intro: 'Use the E-File menu to review the accuracy of the return(s) by clicking on the Perform Review option and selecting Transmit Return will create and transmit the return(s) once the validation errors are corrected.'
                    },
                    {
                        element: '#step11',
                        position: 'right',
                        intro: 'The state forms list contains all the forms in your clients state return. If you have multiple state returns for one client, you will have a State Forms list for each state.'
                    },

                    {
                        element: '#step12',
                        position: 'top',
                        intro: 'When you review a return, the validation messages are displayed here. Each message has a button you can press to be taken to the form and field where you can correct the error.'
                    },
                    {
                        element: '#step13',
                        position: 'left',
                        intro: 'To refresh the list of validation errors click on the Refresh icon and to close the panel press on the X icon. You can arrange the validation error messages by Type, Severity, Form Name, and Error Message by clicking on the column headers.'
                    },
                    {
                        element: '#step14',
                        position: 'left',
                        intro: 'The training panel displays training articles based on the form, field or area of the program you are in.'
                    }
                ]
            }
        },
        home: {
            home: {
                steps: [
                    {
                        element: '#step1',
                        position: 'right',
                        intro: 'The Recent Returns widget lists the returns that have been recently edited in your office. The most recently modified return is listed first.'
                    },
                    {
                        element: '#step2',
                        position: 'right',
                        intro: 'Click here to begin preparing a new return. You select the return type on the subsequent pages.'
                    },
                    {
                        element: '#step3',
                        position: 'left',
                        intro: 'Click here to view a list of all your clients\" returns . You can select the return status from the Status drop down menu. Clicking on the Actions gear will give you the ability to print client organizers and delete a return.'
                    },
                    {
                        element: '#step4',
                        position: 'right',
                        intro: 'The Quick Return Summary widget gives you the ability to look up customers\" return info by simply entering an SSN or EIN and pressing enter. Clicking the More option displays in-depth info about the return.'
                    },
                    {
                        element: '#step_financialProductEnrollment',
                        position: 'right',
                        intro: 'Offering tax settlement products to your clients will allow you to generate extra revenue. Enroll with one of our banking partners by completing a bank application.'
                    },
                    // {
                    //     element: '#step6',
                    //     position: 'right',
                    //     intro: 'The Toolbox widget is where you will find the Conversion Wizard to convert your clients\" returns from your prior tax software. Enter pricing for forms, sytems and states, create custom client letters and organizers.'
                    // },
                    {
                        element: '#step9',
                        position: 'left',
                        intro: 'Multi-year functionality is available. You can create prior year returns by using the Tax Year drop down menu and selecting a previous Tax Year.'
                    },
                    {
                        element: '#step7',
                        position: 'left',
                        intro: 'The Rejected Returns widget displays the number of rejected returns by the IRS and/or state agencies.'
                    },

                    {
                        element: '#step8',
                        position: 'left',
                        intro: 'Your Firm widget is where you enter your office information, add users, preparers and Manage your subscription.'
                    }
                ]
            }
        },
        oneTime: {
            home: {
                home: {
                    steps: [
                        {
                            element: '#step9',
                            position: 'left',
                            intro: 'Multi-year functionality is available. You can create prior year returns by using the Tax Year drop down menu and selecting a previous Tax Year.'
                        }
                    ]
                }
            }
        }
    };

    constructor(private commonApiService: CommonAPIService) { }
    getSteps(moduleName, mode, introLevel) {
        if (introLevel === undefined && this.allModuleSteps[moduleName] !== undefined &&
            this.allModuleSteps[moduleName][mode] !== undefined && this.allModuleSteps[moduleName][mode].steps !== undefined) {
            return this.allModuleSteps[moduleName][mode].steps;
        } else if (introLevel && this.allModuleSteps[introLevel][moduleName]
            && this.allModuleSteps[introLevel][moduleName][mode] && this.allModuleSteps[introLevel][moduleName][mode].steps) {
            return this.allModuleSteps[introLevel][moduleName][mode].steps;
        }
        return [];
    }

    getIntroOptions(moduleName, mode, introLevel) {
        const introOptions = {
            steps: this.getSteps(moduleName, mode, introLevel), // steps is different for everey module and mode
            // below is basic config for evry message
            showStepNumbers: false,
            exitOnOverlayClick: true,
            exitOnEsc: true,
            scrollToElement: true,
            nextLabel: '<strong>Next</strong>',
            prevLabel: '<span>Previous</span>',
            skipLabel: 'Skip',
            doneLabel: 'Finish'
        };
        return introOptions;
    }

    getDeviceDetail(deviceId: string) {
        return new Promise((resolve, reject) => {
            this.commonApiService.getPromiseResponse({
                apiName: APINAME.GET_DEVICE_DETAIL,
                parameterObject: { deviceID: deviceId }
            }).then((response) => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    }
}
