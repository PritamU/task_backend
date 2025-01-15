import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { Op, Sequelize } from "sequelize";
import { escape } from "sequelize/lib/sql-string";
import { ErrorCodes } from "../../../constants/errorCodes";
import { UserModel } from "../../../models/entityModels/userModel";
import { TodoModel } from "../../../models/metadataModels/todoModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  CustomRequest,
  JwtPayloadInterface,
  PaginatedQueryResponseDataInterface,
} from "../../../types/commonInterfaces";
import {
  FetchUserPaginationQueryInterface,
  FilterUserInterface,
  UserModelInterface,
} from "../../../types/entity/userInterfaces";
import {
  FilterTodoInterface,
  TodoInterface,
} from "../../../types/metadata/todoInterfaces";
import { generateJwtToken, setCookieHandler } from "../../../utils/cookieUtils";
import {
  getHasNext,
  paginationSortHandler,
} from "../../../utils/paginationUtils";
import { comparePassword, hashPassword } from "../../../utils/passwordHandler";
import { generateRandomSlug } from "../../../utils/slugUtils";

// register user
const registerUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      email,
      name,
      password,
    }: { name: string; email: string; password: string } = req.body;

    let userExists = await UserModel.count({ where: { email } });

    if (userExists > 0) {
      return next(
        createHttpError(
          ErrorCodes.locked,
          "User Already Exists! Log In Instead!"
        )
      );
    }

    let slug = generateRandomSlug(name);
    password = await hashPassword(password);

    let newUser = UserModel.build({ name, email, password, id: slug });

    await newUser.save();

    let payload: JwtPayloadInterface = {
      name: newUser.id,
      isPrimary: false,
    };

    let jwtToken = generateJwtToken(payload);

    setCookieHandler("user.sid", jwtToken, res);

    let isDev = process.env.NODE_ENV === "development";

    let returnObject: BasicResponseInterface = {
      status: true,
      message: isDev ? jwtToken : "Welcome to Todo App!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// login user
const loginUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password }: { email: string; password: string } = req.body;

    let userExists = await UserModel.findOne({ where: { email: email } });

    if (!userExists) {
      return next(createHttpError(ErrorCodes.not_found, "User Not Found!"));
    }

    let { password: hashedPassword, status } = userExists;

    if (!status) {
      return next(
        createHttpError(
          ErrorCodes.unauthorized,
          "This User has currently been disabled!"
        )
      );
    }

    let isPasswordCorrect = await comparePassword(password, hashedPassword);

    if (!isPasswordCorrect) {
      return next(
        createHttpError(ErrorCodes.unauthorized, "Incorrect Password!")
      );
    }

    // add login history

    let payload: JwtPayloadInterface = {
      name: userExists.id,
      isPrimary: false,
    };

    let jwtToken = generateJwtToken(payload);

    setCookieHandler("user.sid", jwtToken, res);

    let isDev = process.env.NODE_ENV === "development";

    let returnObject: BasicResponseInterface = {
      status: true,
      message: isDev ? jwtToken : "Welcome Back to Todo App!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

//  user auth
const userAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name } = req.user || {};

    let user = await UserModel.findOne({
      where: { id: name },
      attributes: ["name", "email"],
      raw: true,
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    let returnObject: BasicDataResponseInterface<{
      name: string;
      email: string;
    }> = {
      status: true,
      data: { name: user.name, email: user.email },
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// logout user
const logoutUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("user.sid", { domain: process.env.COOKIE_DOMAIN });

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "User Logged Out!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

//  fetch users
const fetchUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      limit,
      page,
      searchKey,
      sortField,
      sortValue,
      status,
      userId,
    }: FetchUserPaginationQueryInterface = req.query;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterUserInterface = {
      limit: newLimit,
      offset: skip,
      order: sortArray,
      where: {},
      attributes: { exclude: ["password", "search_vector"] },
      raw: true,
    };

    if (status !== undefined) {
      filterObject.where!.status = status;
    }
    if (userId) {
      filterObject.where!.id = userId;
    }
    if (searchKey) {
      let escapedSearchKey = escape(searchKey);
      filterObject.where[Op.and] = [
        Sequelize.literal(
          `search_vector @@ to_tsquery('english', ${escapedSearchKey} || ':*')`
        ),
      ];
    }

    console.log("filterObject", filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedQueryResponseDataInterface<UserModelInterface>
    > = {
      status: true,
      data: { count: 0, hasNext: false, data: [] },
    };

    let count = await UserModel.count(filterObject);

    if (count > 0) {
      let users = await UserModel.findAll(filterObject);

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: {
          count,
          hasNext,
          data: users,
        },
      };
    }

    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

//  fetch user details
const fetchUserDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userId }: { userId?: string } = req.params;

    let user = await UserModel.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
      raw: true,
    });

    if (!user) {
      return next(createHttpError(ErrorCodes.not_found, "User Not Found!"));
    }

    let returnObject: BasicDataResponseInterface<UserModelInterface> = {
      status: true,
      data: user,
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

//  update user status
const updateUserStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userId, status }: { userId: string; status: boolean } = req.body;

    let user = await UserModel.findOne({
      where: { id: userId },
      attributes: ["status", "id"],
    });

    if (!user) {
      return next(createHttpError(ErrorCodes.not_found, "User Not Found"));
    }

    console.log("user", user);

    user.status = status;
    await user.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "User Status Updated!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// delete user
const deleteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userId }: { userId: string } = req.body;

    let destroyCount = await UserModel.destroy({
      where: { id: userId },
    });

    if (destroyCount === 0) {
      return next(createHttpError(ErrorCodes.not_found, "Some Error Occured"));
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "User Deleted!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// fetch user homepage data
const fetchHomePageData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name } = req.user!;

    let { tag }: { tag?: string } = req.query;

    let filterObject: FilterTodoInterface = {
      where: { userId: name },
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["search_vector", "userId", "index", "subTasks"],
      },
      raw: true,
    };

    if (tag) {
      filterObject.where.tag = tag;
    }

    let tasks = await TodoModel.findAll(filterObject);

    let inProgressTasks: TodoInterface[] = [];
    let lateTasks: TodoInterface[] = [];
    let completedTasks: TodoInterface[] = [];
    let countOfIncompleteTasks = tasks.length;
    let countOfCompletedTasks = 0;

    tasks.map((taskItem) => {
      let { status, priority, tag, startAt, endAt } = taskItem;
      if (["in-progress", "pending"].includes(status)) {
        inProgressTasks.push(taskItem);
      } else if (status === "completed") {
        countOfCompletedTasks += 1;
        completedTasks.push(taskItem);
      }
      if (status !== "completed" && endAt > new Date()) {
        lateTasks.push(taskItem);
      }
    });

    let returnObject: BasicDataResponseInterface<{
      inProgressTasks: TodoInterface[];
      lateTasks: TodoInterface[];
      completedTasks: TodoInterface[];
      countOfCompletedTasks: number;
      countOfIncompleteTasks: number;
    }> = {
      status: true,
      data: {
        inProgressTasks,
        lateTasks,
        completedTasks,
        countOfCompletedTasks,
        countOfIncompleteTasks,
      },
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

export {
  deleteUser,
  fetchHomePageData,
  fetchUserDetails,
  fetchUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUserStatus,
  userAuth,
};
