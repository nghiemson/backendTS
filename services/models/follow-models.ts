import { User } from "./auth-models";

export interface Follow {
    id: string;
    followerUserId: string;
    followingUserId: string;
    createdAt: string;
    updatedAt: string;
    follower?: User;
    following?: User;
}

export interface FollowUnfollowUserParams {
    followerUserId: string;
    followingUserId: string;
}

export interface GetFollowingsOnFollowersParams {
    userId: string;
    pageSize?: number;
    pageNumber?: number;
}

export interface FollowResponse {
    remainingCount: number;
    remainingPages: number;
    count: number;
    follows: Follow[];
}