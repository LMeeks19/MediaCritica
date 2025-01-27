export interface UserModel {
    id: number;
    forename: string;
    surname: string;
    email: string;
    password: string;
    preference: PreferenceModel;
    totalReviews: number;
    totalBacklogs: number
}

export interface PreferenceModel {
    id: number
    theme: string;
    palette: string;
}