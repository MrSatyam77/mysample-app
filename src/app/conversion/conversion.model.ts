/** File list */
export interface IFileList {
    fileName: string;
    createdDate: string;
    isValid: boolean;
    size?: number;
    oldReturnId?: string;
    oldCreatedDate?: string;
    decision?: number;
    isSelected?: boolean;
    relativePath?: string;
}

/** Decision  */
export enum DECISION {
    NEW = 1,
    OVERWRITE = 2,
    SKIP = 3
}