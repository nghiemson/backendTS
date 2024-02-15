export interface CreatePostParams {
    text: string;
    type: PostType;
    originalPostId?: string;
}

export enum PostType {
    post = "post",
    repost = "repost",
    reply = "reply",
}

export interface Post {
    id: string;
    userId: string;
    text: string;
    type: PostType;
    createdAt: Date;
    updatedAt: Date;
    attachmentId?: string;
}