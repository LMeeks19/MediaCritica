export interface UserModel {
    id: number;
    isAdmin: boolean;
    username: string
    forename: string;
    surname: string;
    email: string;
    preference: PreferenceModel;
    totalReviews: number;
    totalBacklogs: number
    totalNotifications: number;
    totalFollowers: number;
    totalFollowing: number;
}

export interface PreferenceModel {
    id: number
    theme: string;
    palette: string;
    locale: string;
    timezone: string;
}

export interface CreateUserModel {
    username: string
    forename: string;
    surname: string;
    email: string;
    password: string;
    locale: string;
    timezone: string;
}