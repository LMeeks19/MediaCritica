export interface UserModel {
    id: number;
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