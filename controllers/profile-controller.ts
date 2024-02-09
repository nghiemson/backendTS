import { StatusCodes } from "http-status-codes";
import {
    Controller,
    Get,
    OperationId,
    Path,
    Response,
    Route,
    Security,
    Tags,
    Body,
    Post,
    Request,
} from "tsoa";
import { Profile } from "../services/models/profile-model";
import ProfileService from "../services/profile-service";
import { Request as ExpressRequest } from "express";

@Route("api/v1/profile")
@Tags("Profile")
export class ProfileController extends Controller {
    @Response(StatusCodes.OK)
    @Get("info/{userId}")
    @OperationId("getProfile")
    @Security("jwt")
    public async get(@Path() userId: string): Promise<Profile> {
        this.setStatus(StatusCodes.OK);
        return await new ProfileService().get(userId);
    }

    @Response(StatusCodes.OK)
    @Post("info")
    @OperationId("setProfile")
    @Security("jwt")
    public async setProfile(
        @Request() request: ExpressRequest,
        @Body() requestBody: Profile
    ): Promise<Profile> {
        this.setStatus(StatusCodes.OK);
        const user = request.user as { id: string };
        return await new ProfileService().set(user.id, requestBody);
    }
}