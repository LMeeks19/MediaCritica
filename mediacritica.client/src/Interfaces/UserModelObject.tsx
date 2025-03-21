import { AuthToken } from "./AuthToken";
import { UserModel } from "./UserModel";

export interface UserModelObject {
    authToken: AuthToken;
    user: UserModel
}