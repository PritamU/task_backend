import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { ErrorCodes } from "../../../constants/errorCodes";
import { UserModel } from "../../../models/entityModels/userModel";
import {
  CustomRequest,
  JwtPayloadInterface,
} from "../../../types/commonInterfaces";

//check if its user
const userAuthMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies["user.sid"] || req.headers["user.sid"];

    if (!token) {
      return next(
        createHttpError(ErrorCodes.unauthenticated, "Login Required!")
      );
    }

    // Verify the token and extract the payload
    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      (
        err: VerifyErrors | null,
        decoded: JwtPayload | JwtPayloadInterface | string | undefined
      ) => {
        if (err) {
          return next(
            createHttpError(ErrorCodes.unauthenticated, "Invalid Token!")
          );
        }
        // Token verification successful, decoded contains the payload
        req.user = decoded as JwtPayloadInterface;
      }
    );

    //fetch user data
    let userData = await UserModel.findOne({
      where: {
        id: req.user!.name,
      },
      raw: true,
    });

    // return error if user data not found
    if (!userData) {
      return next(
        createHttpError(ErrorCodes.unauthenticated, "User Credentials Invalid!")
      );
    }

    let { status } = userData;

    // return error if admin is deleted
    if (!status) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "Your Current Credentials Has been Disabled!"
        )
      );
    }
  } catch (e: any) {
    res.clearCookie("user.sid", { domain: process.env.COOKIE_DOMAIN });
    return next(createHttpError(ErrorCodes.server_error, e.message));
  } finally {
    next();
  }
};

export { userAuthMiddleware };
