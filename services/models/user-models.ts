import { User } from "./auth-models";

export interface SetUsernameParams {
    username: string;
}

export interface SetUsernameResponse {
    user: User;
}

export interface DeleteUserResponse {
    reactionsDeleted: number;
    attachmentsDeleted: number;
    postsDeleted: number;
    profileDeleted: number;
    followsDeleted: number;
    userDeleted: number;
}