import { Document, Schema, Types, model } from "mongoose";

const PostSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    text: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, "Your post cannot exceed 500 characters"],
      minlength: [3, "Your title must be at least 3 characters long"],
    },
    type: {
      type: String,
      required: [true, "Please provide a post type"],
      default: "post",
      enum: ["post", "repost", "reply"],
    },
    originalPostId: {
      type: Types.ObjectId,
      ref: "Post",
      required: false,
    },
    attachmentId: {
      type: Types.ObjectId,
      ref: "Attachment",
      required: false,
    },
  },
  { timestamps: true }
);

PostSchema.methods.toJson = function (): any {
  return {
    id: this._id,
    userId: this.userId,
    text: this.text,
    type: this.type,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    attachmentId: this.attachmentId,
  };
};

enum PostType {
    post = "post",
    repost = "repost",
    reply = "reply",
}

interface PostDocument extends Document {
    userId: Types.ObjectId;
    text?: string;
    type: PostType;
    originalPostId?: Types.ObjectId;
    attachmentId?: Types.ObjectId;
    toJson: () => any;
}
export default model<PostDocument>("Post", PostSchema);
