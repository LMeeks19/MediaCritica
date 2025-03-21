export interface AuthToken {
    id: number;
    userId: number;
    token: string;
    expiration: Date
}