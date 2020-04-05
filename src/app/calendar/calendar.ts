export interface  IAppointments {
    //Old fields
    id?: string;
    color: string;
    textColor: string;
    subject: string;
    description: string;
    start: string;
    end: string;
    participants: string[];
    isPrivate: boolean;
    remindMeBefore?: number;
    alertTime?: string;
    snoozeCount?: number;
    //new filed
    // firstName: string;
    // lastName: string;
    // cellPhone: string;
    // emailAddress: string;
    // street: string;
    // zipCode: string;
    // city: string;
    // state: string;
    // returnno: string;
    // sendList: any[];
}

export interface IScheduler {
    color?: string;
    textColor?: string;
    subject?: string;
    description?: string;
    start?: string;
    end?: string;
    id?: string
}