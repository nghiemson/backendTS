import Post from "../db/models/post";
import { PostType, Post as TSOAPostModel } from "./models/posts-models";
import { PostsResponse, QueryPostsParams} from "./models/queries-models";
const { max, min } = Math;

export default class QueriesService {
    public async queryPosts(
        params: QueryPostsParams,
        requestUserId: String,
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
        const remainingCount = max(totalPosts - (pageNumber + 1) * pageSize, 0)
        const remainingPages = Math.ceil(remainingCount / pageSize);

        return {
            remainingCount: remainingCount,
            remainingPages: remainingPages,
            count: posts.length,
            posts: posts.map((post) => post.toJSON() as TSOAPostModel),
        }
    }
}