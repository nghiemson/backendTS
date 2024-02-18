import { StatusCodes } from "http-status-codes";
import {
  Controller,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
  Delete,
  Get,
  Query,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import { FollowService } from "../services/follow-service";
import { Follow, FollowResponse } from "../services/models/follow-models";

@Route("/api/v1/follow")
@Tags("Follow")
export class FollowController extends Controller {
  /**
   *  allows a user to follow another user
   */
  @Post("/{userId}")
  @OperationId("followUser")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  public async followUser(
    @Request() request: ExpressRequest,
    @Path() userId: string
  ): Promise<Follow> {
    const user = request.user as AuthenticatedUser;
    const followerUserId = user.id;
    const followingUserId = userId;
    return new FollowService().followUser({
      followerUserId,
      followingUserId,
    });
  }

  /**
   * user unfollow another user
   */
  @Delete("/{userId}")
  @OperationId("unfollowUser")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  public async unfollowUser(
    @Request() request: ExpressRequest,
    @Path() userId: string
  ): Promise<Follow> {
    const user = request.user as AuthenticatedUser;
    const followerUserId = user.id;
    const followingUserId = userId;
    return new FollowService().unfollowUser({
      followerUserId,
      followingUserId,
    });
  }

  /**
   * get all the users that a user is following
   */
  @Get("/{userId}/following")
  @OperationId("getUserFollowing")
  @Security("jwt")
  @Response(StatusCodes.OK)
  public async getUserFollowing(
    @Path() userId: string,
    @Query() pageSize?: number,
    @Query() pageNumber?: number
  ): Promise<FollowResponse> {
    return new FollowService().getUserFollowing({
      userId,
      pageSize,
      pageNumber,
    });
  }
  /**
   * get list of users that are following the specified user
   */
  @Get("/{userId}/followers")
  @OperationId("getUserFollowers")
  @Security("jwt")
  @Response(StatusCodes.OK)
  public async getUserFollowers(
    @Path() userId: string,
    @Query() pageSize?: number,
    @Query() pageNumber?: number
  ): Promise<FollowResponse> {
    return new FollowService().getUserFollowers({
      userId,
      pageSize,
      pageNumber,
    });
  }
}
