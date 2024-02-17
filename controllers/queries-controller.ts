import { StatusCodes } from "http-status-codes";
import {
    Controller,
    Get, 
    OperationId,
    Query,
    Request,
    Response,
    Route,
    Security,
    Tags,
} from "tsoa";
import * as express from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import { PostsResponse } from "../services/models/queries-models";
import { PostType } from "../services/models/posts-models";
import QueriesService from "../services/queries-service";

@Route("/api/v1/query")
@Tags("Queries")
export class QueriesController extends Controller {
    /**
     *  Retrieves posts with given parameters, with pagination.
     */ 
    @Get("/posts")
    @OperationId("queryPosts")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
    @Security("jwt")
    public async queryPosts(
        @Request() request: express.Request,
        @Query() userId?: string,
        @Query() pageSize?: number,
        @Query() pageNumber?: number,
        @Query() type?: PostType,
    ): Promise<PostsResponse> {
        const user = request.user as AuthenticatedUser;
        const resolvedUserId = userId ?? user.id;
        return new QueriesService().queryPosts(
            {
            userId: resolvedUserId,
            pageSize,
            pageNumber,
            type,
            },
            resolvedUserId
        );
    }
}