import User from "../db/models/user";
import { BadRequestError } from "../errors";
import {
  SetUsernameParams,
  SetUsernameResponse,
  DeleteUserResponse,
} from "./models/user-models";
import { unlink } from "node:fs/promises";
import Attachment from "../db/models/attachment";
import Follow from "../db/models/follow";
import Post from "../db/models/post";
import Profile from "../db/models/profile";
import Reaction from "../db/models/reaction";
import {
  getAttachmentPath,
  getUserIdProfilePhotoPath,
} from "../controllers/utils";

export default class UserService {
  public async setUsername(
    userId: string,
    params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: params.username },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) {
      throw new BadRequestError();
    }
    return {
      user: user.toJSON(),
    };
  }

  public async deleteUser(userId: string): Promise<DeleteUserResponse> {
    //delete all reactions
    const { deletedCount: reactionsDeleted } = await Reaction.deleteMany({ userId });

    //delete profile photo
    const profilePhotoPath = getUserIdProfilePhotoPath(userId);
    try {
        await unlink(profilePhotoPath);
    } catch (err) {}

    //delete all attachment for posts
    const attachments = await Attachment.find({ userId });
    for (const attachment of attachments) {
        const attachmentPath = getAttachmentPath(attachment._id);
        try {
            await unlink(attachmentPath);
        } catch (err) {}
    }
    const { deletedCount: attachmentsDeleted } = await Attachment.deleteMany({ userId });

    //delete all posts, reposts and replies
    const { deletedCount: postsDeleted } = await Post.deleteMany({ userId });

    //delete profile
    const { deletedCount: profileDeleted } = await Profile.deleteOne({ userId });

    //delete all follows
    const { deletedCount: followsDeleted } = await Follow.deleteMany({ followerUserId: userId });

    //delete user
    const { deletedCount: userDeleted } = await User.deleteOne({ _id: userId });

    return {
        reactionsDeleted,
        attachmentsDeleted,
        postsDeleted,
        profileDeleted,
        followsDeleted,
        userDeleted,
    };
  }
}
