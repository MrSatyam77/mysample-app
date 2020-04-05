export interface ISettings {
    locationId?: string;
    questionSets?: IQuestionsSet[];
    selectedQuestionSet?: string;
    emailTemplates?: IEmailTemplates[];
}

export interface IQuestionsSet {
    title?: string;
    id?: string;
    questions?: any[];
}

export interface IEmailTemplates {
    id?: string;
    name?: string;
    subject?: string;
    body?: string;
}