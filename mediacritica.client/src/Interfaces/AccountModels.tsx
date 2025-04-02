import { AccountFieldType } from "../Enums/AccountFieldType";

export interface AccountEditModel {
    isEditing: boolean;
    fieldType: AccountFieldType | null;
}

export interface AccountFieldValue {
    value: string;
    type: AccountFieldType | null;
}