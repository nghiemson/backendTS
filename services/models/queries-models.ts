import { Post, PostType } from "./posts-models";

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