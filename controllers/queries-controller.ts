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
  Path,
} from "tsoa";
import * as express from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import {
  PostsResponse,
  ReactionResponse,
  PostStatsResponse,
} from "../services/models/queries-models";
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
    @Query() type?: PostType
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

  /**
   *  Retrieves replies with given parameters, with pagination.
   */
  @Get("/replies/{postId}")
  @OperationId("getReplies")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReplies(
    @Path() postId: string,
    @Query() pageSize?: number,
    @Query() pageNumber?: number
  ): Promise<PostsResponse> {
    return new QueriesService().getReplies({
      postId,
      pageSize,
      pageNumber,
    });
  }

  /**
   *  Retrieves reactions made by a user with given parameters, with pagination.
   */
  @Get("/reactions/{userId}")
  @OperationId("getReactions")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getReactions(
    @Request() request: express.Request,
    @Path() userId?: string,
    @Query() pageSize?: number,
    @Query() pageNumber?: number
  ): Promise<ReactionResponse> {
    const user = request.user as AuthenticatedUser;
    const requestUserId = user.id;
    return new QueriesService().getReactions(
      {
        userId,
        pageSize,
        pageNumber,
      },
      requestUserId
    );
  }

  /**
   *  Retrieves reactions made by current user with given parameters, with pagination.
   */
  @Get("/reactions/")
  @OperationId("getCurrentUserReactions")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getCurrentUserReactions(
    @Request() request: express.Request,
    @Query() pageSize?: number,
    @Query() pageNumber?: number
  ): Promise<ReactionResponse> {
    return this.getReactions(request, undefined, pageSize, pageNumber);
  }

  /**
   *  Retrieves stats for a post: number of reactions, replies and reposts.
   */
  @Get("/stats/{postId}")
  @OperationId("getPostStats")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Security("jwt")
  public async getPostStats(
    @Path() postId: string
  ): Promise<PostStatsResponse> {
    return new QueriesService().getPostStats(postId);
  }
}
