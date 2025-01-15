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
  PaginatedQueryResponseDataInterface,
} from "../../../types/commonInterfaces";
import {
  FetchTodoPaginationQueryInterface,
  FilterTodoInterface,
  TodoInterface,
} from "../../../types/metadata/todoInterfaces";
import {
  getHasNext,
  paginationSortHandler,
} from "../../../utils/paginationUtils";

// delete todo
const deleteTodoByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      todoId,
    }: {
      todoId: string;
    } = req.body;

    let deleteHandler = await TodoModel.destroy({
      where: { id: todoId },
    });

    if (deleteHandler === 0) {
      return next(
        createHttpError(ErrorCodes.server_error, "Some Error Occured!")
      );
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Task Deleted!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

//  fetch todos
const fetchTodosByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      limit,
      page,
      sortField,
      sortValue,
      status,
      priority,
      tag,
      searchKey,
      userId,
    }: FetchTodoPaginationQueryInterface = req.query;

    let {
      page: newPage,
      limit: newLimit,
      skip,
      sortArray,
    } = paginationSortHandler(page, limit, sortField, sortValue);

    let filterObject: FilterTodoInterface = {
      limit: newLimit,
      offset: skip,
      order: sortArray,
      where: {},
      attributes: {
        exclude: ["search_vector", "index", "subTasks", "userId"],
      },
      include: {
        model: UserModel,
        attributes: ["id", "name"],
      },
      raw: true,
    };

    if (status !== undefined) {
      filterObject.where!.status = status;
    }
    if (priority) {
      filterObject.where!.priority = priority;
    }
    if (tag) {
      filterObject.where!.tag = tag;
    }
    if (searchKey) {
      let escapedSearchKey = escape(searchKey);
      filterObject.where[Op.and] = [
        Sequelize.literal(
          `search_vector @@ to_tsquery('english', ${escapedSearchKey} || ':*')`
        ),
      ];
    }
    if (userId) {
      filterObject.where!.userId = userId;
    }

    console.log("filterObject", filterObject);

    let returnObject: BasicDataResponseInterface<
      PaginatedQueryResponseDataInterface<TodoInterface>
    > = {
      status: true,
      data: { count: 0, hasNext: false, data: [] },
    };

    let count = await TodoModel.count(filterObject);

    if (count > 0) {
      let todos = await TodoModel.findAll(filterObject);

      let hasNext = getHasNext(newPage, newLimit, count);

      returnObject = {
        status: true,
        data: {
          count,
          hasNext,
          data: todos,
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

//  fetch todo details
const fetchTodoDetailsByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { todoId }: { todoId?: string } = req.params;

    let todo = await TodoModel.findOne({
      where: { id: todoId },
      raw: true,
      attributes: { exclude: ["index", "search_vector", "userId"] },
      include: {
        model: UserModel,
        attributes: ["id", "name"],
      },
    });

    if (!todo) {
      return next(createHttpError(ErrorCodes.not_found, "Todo Not Found!"));
    }

    let returnObject: BasicDataResponseInterface<TodoInterface> = {
      status: true,
      data: todo,
    };

    returnObject = {
      status: true,
      data: todo,
    };

    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

export { deleteTodoByAdmin, fetchTodoDetailsByAdmin, fetchTodosByAdmin };
