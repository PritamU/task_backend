import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { ErrorCodes } from "../../../constants/errorCodes";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  CustomRequest,
  JwtPayloadInterface,
  PaginatedQueryResponseDataInterface,
} from "../../../types/commonInterfaces";
import {
  AdminModelInterface,
  FetchAdminPaginationQueryInterface,
  FilterAdminInterface,
} from "../../../types/entity/adminInterfaces";

import { AdminModel } from "../../../models/entityModels/adminModel";

import { generateJwtToken, setCookieHandler } from "../../../utils/cookieUtils";
import {
  getHasNext,
  paginationSortHandler,
} from "../../../utils/paginationUtils";
import { comparePassword, hashPassword } from "../../../utils/passwordHandler";
import { generateRandomSlug } from "../../../utils/slugUtils";

// create new admin
const createAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      isPrimary,
      name,
      password,
      username,
    }: {
      name: string;
      username: string;
      password: string;
      isPrimary: boolean;
    } = req.body;

    let { isPrimary: isCurrentAdminPrimary } = req.user || {};

    if (!isCurrentAdminPrimary) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "You are not authorized to perform this action!"
        )
      );
    }

    console.log("req.body", req.body);

    let slug = generateRandomSlug(name);

    console.log("slug", slug);

    let hashedPassword = await hashPassword(password);

    console.log("hashedPassword", hashedPassword);

    let newAdmin = AdminModel.build({
      id: slug,
      name,
      username,
      isPrimary,
      password: hashedPassword,
    });

    console.log("newAdmin", newAdmin);

    await newAdmin.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Created!",
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// login admin
const adminLogin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      password,
      username,
    }: {
      username: string;
      password: string;
    } = req.body;

    console.log("req.body", req.body);

    let payload: JwtPayloadInterface = {
      name: username,
      isPrimary: false,
    };

    if (username === process.env.SUPER_ADMIN_USERNAME) {
      console.log("if");
      if (username !== process.env.SUPER_ADMIN_PASSWORD) {
        createHttpError(ErrorCodes.unauthorized, "Incorrect Password!");
      }
      payload = {
        ...payload,
        name: username,
        isPrimary: true,
      };
    } else {
      console.log("else");
      let admin = await AdminModel.findOne({ where: { username: username } });

      console.log("admin", admin);

      if (!admin) {
        return next(createHttpError(ErrorCodes.not_found, "Admin Not Found!"));
      }

      let { password: hashedPassword, status } = admin;

      if (!admin) {
        return next(
          createHttpError(
            ErrorCodes.unauthorized,
            "Your Current Admin Credentials Has been Disabled!"
          )
        );
      }
      let isPasswordCorrect = await comparePassword(password, hashedPassword);

      if (!isPasswordCorrect) {
        return next(
          createHttpError(ErrorCodes.unauthorized, "Incorrect Password!")
        );
      }
      payload = {
        ...payload,
        name: username,
        isPrimary: admin.isPrimary,
      };
    }

    let jwtToken = generateJwtToken(payload);

    setCookieHandler("admin.sid", jwtToken, res);

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Login Successful!",
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

// admin auth
const adminAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let returnObject: BasicDataResponseInterface<JwtPayloadInterface> = {
      status: true,
      data: { name: req.user!.name, isPrimary: req.user!.isPrimary },
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

// admin logout
const adminLogout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("admin.sid", { domain: process.env.COOKIE_DOMAIN });

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Logged Out!",
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

// fetch admins
const fetchAdmins = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      page,
      limit,
      sortField,
      sortValue,
      status,
      isPrimary,
    }: FetchAdminPaginationQueryInterface = req.query;

    let { isPrimary: isCurrentAdminPrimary } = req.user || {};

    if (!isCurrentAdminPrimary) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "You are not authorized to perform this action!"
        )
      );
    }

    console.log("req.query", req.query);

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    console.log("sortArray", sortArray);

    let filterObject: FilterAdminInterface = {
      limit: newLimit,
      offset: skip,
      where: {},
      order: sortArray,
      attributes: { exclude: ["password"] },
    };

    if (status !== undefined) {
      filterObject.where!.status = status;
    }
    if (isPrimary !== undefined) {
      filterObject.where!.isPrimary = isPrimary;
    }

    console.log("filterObject", filterObject);

    let count = await AdminModel.count(filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedQueryResponseDataInterface<AdminModelInterface>
    > = {
      status: true,
      data: {
        count: 0,
        hasNext: false,
        data: [],
      },
    };

    if (count > 0) {
      let admins = await AdminModel.findAll({ ...filterObject });

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: { count, hasNext, data: admins },
      };
    }

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

// editAdmin
const editAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      adminId,
      isPrimary,
      status,
    }: {
      adminId: string;
      isPrimary?: boolean;
      status?: boolean;
    } = req.body;

    let { isPrimary: isCurrentAdminPrimary } = req.user || {};

    if (!isCurrentAdminPrimary) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "You are not authorized to perform this action!"
        )
      );
    }

    let [affectedCount] = await AdminModel.update(
      {
        isPrimary,
        status,
      },
      { where: { id: adminId } }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Updated!",
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

// delete admin
const deleteAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      adminId,
    }: {
      adminId: string;
    } = req.body;

    let { name } = req.user || {};

    if (name !== process.env.SUPER_ADMIN_USERNAME) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "You are not authorized to perform this action!"
        )
      );
    }

    let affectedCount = await AdminModel.destroy({ where: { id: adminId } });

    if (affectedCount === 0) {
      throw new Error("Some Error Occured");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Admin Deleted!",
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    return next(createHttpError(ErrorCodes.server_error, e.message));
  }
};

export {
  adminAuth,
  adminLogin,
  adminLogout,
  createAdmin,
  deleteAdmin,
  editAdmin,
  fetchAdmins,
};
