import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { ErrorCodes } from "../../../constants/errorCodes";
import { AdminModel } from "../../../models/entityModels/adminModel";
import {
  CustomRequest,
  JwtPayloadInterface,
} from "../../../types/commonInterfaces";

//check if its admin
const adminAuthMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies["admin.sid"];

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

    if (req.user!.name !== process.env.SUPER_ADMIN_USERNAME) {
      //fetch admin data
      let adminData = await AdminModel.findOne({
        where: {
          username: req.user!.name,
        },
        raw: true,
      });

      // return error if admin data not found
      if (!adminData) {
        return next(
          createHttpError(
            ErrorCodes.unauthenticated,
            "Admin Credentials Invalid!"
          )
        );
      }

      let { status } = adminData;

      // return error if admin is deleted
      if (!status) {
        return next(
          createHttpError(
            ErrorCodes.unauthorized,
            "Your Current Admin Credentials Has been Disabled!"
          )
        );
      }
    }
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  } finally {
    next();
  }
};

export { adminAuthMiddleware };
