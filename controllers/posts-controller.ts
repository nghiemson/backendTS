import { StatusCodes } from "http-status-codes";
import PostService from "../services/posts-service";
import {
    Body,
    Controller,
    OperationId,
    Response,
    Post,
    Request,
    Route,
    Security,
    Tags,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
    CreatePostParams,
    Post as PostModel,
} from "../services/models/posts-models";

@Route("/api/v1/posts")
@Tags("Posts")
export class PostsController extends Controller {
    @Response(StatusCodes.CREATED)
    @Response(StatusCodes.BAD_REQUEST, "original post ID is missing")
    @Post("")
    @OperationId("createPost")
    @Security("jwt")
    public async createPost(
        @Request() request: ExpressRequest,
        @Body() body: CreatePostParams
    ): Promise<PostModel> {
        const user = request.user as AuthenticatedUser;
        return await new PostService().createPost(user.id, body);
    }
}