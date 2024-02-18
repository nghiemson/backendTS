import Reaction from "../db/models/reaction";
import Post from "../db/models/post";
import {
  PostType,
  Post as TSOAPostModel,
  Reaction as TSOAReactionModel,
} from "./models/posts-models";
import {
  PostsResponse,
  QueryPostsParams,
  GetRepliesParams,
  GetUserReactionsParams,
  ReactionResponse,
  PostStatsResponse,
} from "./models/queries-models";
const { max, min } = Math;

export default class QueriesService {
  public async queryPosts(
    params: QueryPostsParams,
    requestUserId: String
  ): Promise<PostsResponse> {
    const userId = params.userId || requestUserId;
    const pageSize = min(params.pageSize ?? 10, 100);
    const pageNumber = params.pageNumber ?? 0;
    const type = params.type || PostType.post;

    const skip = pageSize * pageNumber;
    const posts = await Post.find({ userId, type }, null, {
      skip: skip,
      limit: pageSize,
      sort: { createdAt: -1 },
    });

    const totalPosts = await Post.countDocuments({ userId, type });
    const remainingCount = max(totalPosts - (pageNumber + 1) * pageSize, 0);
    const remainingPages = Math.ceil(remainingCount / pageSize);

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReplies(params: GetRepliesParams): Promise<PostsResponse> {
    const postId = params.postId;
    const pageSize = min(params.pageSize ?? 10, 100);
    const pageNumber = params.pageNumber ?? 0;

    const skip = pageSize * pageNumber;
    const type = "reply";

    const posts = await Post.find({ type, originalPostId: postId }, null, {
      skip: skip,
      limit: pageSize,
    });

    const totalPosts = await Post.countDocuments({
      type,
      originalPostId: postId,
    });
    const remainingCount = max(totalPosts - (pageNumber + 1) * pageSize, 0);
    const remainingPages = Math.ceil(remainingCount / pageSize);

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: posts.length,
      posts: posts.map((post) => post.toJSON() as TSOAPostModel),
    };
  }

  public async getReactions(
    params: GetUserReactionsParams,
    requestUserId: String
  ): Promise<ReactionResponse> {
    const userId = params.userId || requestUserId;
    const pageSize = min(params.pageSize ?? 10, 100);
    const pageNumber = params.pageNumber ?? 0;

    const skip = pageSize * pageNumber;
    const reactions = await Reaction.find({ userId }, null, {
      skip: skip,
      limit: pageSize,
      sort: { createdAt: -1 },
    });

    const totalReactions = await Reaction.countDocuments({ userId });
    const remainingCount = max(totalReactions - (pageNumber + 1) * pageSize, 0);
    const remainingPages = Math.ceil(remainingCount / pageSize);

    return {
      remainingCount: remainingCount,
      remainingPages: remainingPages,
      count: reactions.length,
      reactions: reactions.map(
        (reaction) => reaction.toJSON() as TSOAReactionModel
      ),
    };
  }

  public async getPostStats(postId: String): Promise<PostStatsResponse> {
    const reactionCount = await Reaction.countDocuments({ postId });
    const replyCount = await Post.countDocuments({
      originalPostId: postId,
      type: "reply",
    });
    const repostCount = await Post.countDocuments({
      originalPostId: postId,
      type: "repost",
    });
    return { reactionCount, replyCount, repostCount };
  }
}
