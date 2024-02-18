import { Post, PostType, Reaction } from "./posts-models";

export interface QueryPostsParams {
    userId: string;
    pageSize?: number;
    pageNumber?: number;
    type?: PostType;
}

export interface PostsResponse {
    remainingCount: number;
    remainingPages: number;
    count: number;
    posts: Post[];
}

export interface GetRepliesParams {
    postId: string;
    pageSize?: number;
    pageNumber?: number;
}

export interface GetUserReactionsParams {
    userId?: string;
    pageSize?: number;
    pageNumber?: number;
}

export interface ReactionResponse {
    remainingCount: number;
    remainingPages: number;
    count: number;
    reactions: Reaction[];
}

export interface PostStatsResponse {
    reactionCount: number;
    replyCount: number;
    repostCount: number;
}