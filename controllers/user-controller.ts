import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  SetUsernameParams,
  SetUsernameResponse,
  DeleteUserResponse,
} from "../services/models/user-models";
import {
  Body,
  Controller,
  OperationId,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
  Delete,
} from "tsoa";
import AuthenticatedUser from "../middleware/models/authenticated-user";
import UserService from "../services/user-service";
import AuthService from "../services/auth-services";

@Route("/api/v1/users")
@Tags("User")
export class UserController extends Controller {
  /**
   *  Set the username of the user
   */
  @Post("/username")
  @OperationId("setUsername")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.BAD_REQUEST, "Bad Request")
  @Security("jwt")
  public async setUsername(
    @Request() request: ExpressRequest,
    @Body() params: SetUsernameParams
  ): Promise<SetUsernameResponse> {
    const { id: userId } = request.user as AuthenticatedUser;
    return new UserService().setUsername(userId, params);
  }

  /**
   * deletes a user and all their data
   */
  @Delete("")
  @OperationId("deleteUser")
  @Response(StatusCodes.OK)
  @Security("jwt")
  public async deleteUser(
    @Request() request: ExpressRequest
  ): Promise<DeleteUserResponse> {
    const { id: userId, jti } = request.user as AuthenticatedUser;
    const result = new UserService().deleteUser(userId);
    await new AuthService().logout(jti);
    return result;
  }
}
