import Follow from "../db/models/follow";
import { BadRequestError } from "../errors";
import {
  FollowUnfollowUserParams,
  Follow as TSOAFollowModel,
  FollowResponse,
  GetFollowingsOnFollowersParams,
} from "./models/follow-models";
const { max } = Math;
export class FollowService {
  public async followUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const { followerUserId: userId, followingUserId } = params;

    // user cannot follow self
    if (userId === followingUserId) {
      throw new BadRequestError();
    }

    // check following or not
    const existingFollow = await Follow.findOne({
      followerUserId: userId,
      followingUserId: followingUserId,
    });

    if (existingFollow) {
      throw new BadRequestError("Already following this user");
    }

    //create follow
    const follow = await Follow.create({
      followerUserId: userId,
      followingUserId: followingUserId,
    });

    return follow.toJSON() as TSOAFollowModel;
  }

  public async unfollowUser(
    params: FollowUnfollowUserParams
  ): Promise<TSOAFollowModel> {
    const deleteFollow = await Follow.findOneAndDelete(params);

    if (!deleteFollow) {
      throw new BadRequestError("Not following this user");
    }

    return deleteFollow.toJSON() as TSOAFollowModel;
  }

  public async getUserFollowing(
    params: GetFollowingsOnFollowersParams
  ): Promise<FollowResponse> {
    const { userId } = params;
    const pageSize = params.pageSize ?? 10;
    const pageNumber = params.pageNumber ?? 0;
    const skip = pageSize * pageNumber;
    const follows = await Follow.find({ followerUserId: userId }, null, {
      skip: skip,
      limit: pageSize,
      sort: { createdAt: -1 },
    });
    const totalFollows = await Follow.countDocuments({
      followerUserId: userId,
    });
    const remainingCount = max(totalFollows - (pageNumber + 1) * pageSize, 0);
    const remainingPages = Math.ceil(remainingCount / pageSize);
    //resolve references of the follow object
    await Promise.all(
        follows.map(async (follow) => {
            await follow.populateFollowingFiled();
        })
    );
    return {
        remainingCount: remainingCount,
        remainingPages: remainingPages,
        count: follows.length,
        follows: follows.map((follow) => follow.toJSON() as TSOAFollowModel),
    }
  }

  public async getUserFollowers(
    params: GetFollowingsOnFollowersParams
  ): Promise<FollowResponse> {
    const { userId } = params;
    const pageSize = params.pageSize?? 10;
    const pageNumber = params.pageNumber?? 0;
    const skip = pageSize * pageNumber;
    const follows = await Follow.find({ followingUserId: userId }, null, {
      skip: skip,
      limit: pageSize,
      sort: { createdAt: -1 },
    });
    const totalFollows = await Follow.countDocuments({
      followingUserId: userId,
    });
    const remainingCount = max(totalFollows - (pageNumber + 1) * pageSize, 0);
    const remainingPages = Math.ceil(remainingCount / pageSize);
    //resolve references of the follow object
    await Promise.all(
        follows.map(async (follow) => {
            await follow.populateFollowerFiled();
        })
    );
    return {
        remainingCount: remainingCount,
        remainingPages: remainingPages,
        count: follows.length,
        follows: follows.map((follow) => follow.toJSON()),
    }
  }
}
