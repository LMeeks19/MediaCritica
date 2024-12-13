import { AccountFieldType } from "../Enums/AccountFieldType";

export interface AccountEditModel {
    isEditing: boolean;
    fieldType: AccountFieldType | null;
}

export interface AccountFieldValue {
    userId: number;
    value: string;
    type: AccountFieldType | null;
}