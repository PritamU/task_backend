import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { Op, Sequelize } from "sequelize";
import { escape } from "sequelize/lib/sql-string";
import { ErrorCodes } from "../../../constants/errorCodes";
import { TodoModel } from "../../../models/metadataModels/todoModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
  CustomRequest,
  JwtPayloadInterface,
  PaginatedQueryResponseDataInterface,
} from "../../../types/commonInterfaces";
import {
  FetchTodoPaginationQueryInterface,
  FilterTodoInterface,
  PriorityTypes,
  SubtaskInterface,
  TodoInterface,
  TodoStatusTypes,
} from "../../../types/metadata/todoInterfaces";
import {
  getHasNext,
  paginationSortHandler,
} from "../../../utils/paginationUtils";
import { generateRandomSlug } from "../../../utils/slugUtils";

// create todo
const createTodo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      description,
      endAt,
      priority,
      startAt,
      subTasks,
      tag,
      title,
    }: {
      title: string;
      description: string;
      priority: PriorityTypes;
      tag: string;
      startAt: Date;
      subTasks: SubtaskInterface[];
      endAt: Date;
    } = req.body;

    let { name }: JwtPayloadInterface = req.user!;

    subTasks = subTasks.filter((item) => item.title);

    let todoId = generateRandomSlug(title);

    let newTodo = TodoModel.build({
      id: todoId,
      userId: name!,
      title,
      description,
      priority,
      tag,
      startAt,
      endAt,
      subTasks,
    });

    await newTodo.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Task Created!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// update todo
const updateTodo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      todoId,
      description,
      endAt,
      priority,
      startAt,
      subTasks,
      tag,
      title,
    }: {
      todoId: string;
      title?: string;
      description?: string;
      priority?: PriorityTypes;
      tag?: string;
      startAt?: Date;
      subTasks?: SubtaskInterface[];
      endAt?: Date;
    } = req.body;

    let { name }: JwtPayloadInterface = req.user!;

    let status: TodoStatusTypes | undefined = undefined;

    if (subTasks && subTasks.length > 0) {
      subTasks = subTasks.filter((item) => item.title);
      status = "in-progress";
    }

    let [updateHandler] = await TodoModel.update(
      {
        title,
        description,
        priority,
        tag,
        startAt,
        subTasks,
        endAt,
        status,
      },
      {
        where: {
          id: todoId,
          userId: name,
          status: { [Op.notIn]: ["completed"] },
        },
      }
    );

    if (updateHandler === 0) {
      return next(
        createHttpError(ErrorCodes.server_error, "Some Error Occured!")
      );
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Task Updated!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// update todo status
const updateTodoStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      todoId,
      status,
    }: {
      todoId: string;
      status: TodoStatusTypes;
    } = req.body;

    let { name }: JwtPayloadInterface = req.user!;

    let todo = await TodoModel.findOne({
      where: {
        id: todoId,
        userId: name,
      },
      attributes: {
        include: ["status", "subTasks"],
      },
    });

    if (!todo) {
      return next(createHttpError(ErrorCodes.not_found, "No Task Found!"));
    }

    if (todo.status === "completed") {
      return next(
        createHttpError(
          ErrorCodes.locked,
          "Completed Tasks Cannot be Updated Again!"
        )
      );
    }

    if (status === "completed") {
      todo.subTasks = todo.subTasks.map((item) => {
        return { ...item, status: true };
      });
    }

    todo.status = status;
    await todo.save();

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Task Status Updated!",
    };
    res.json(returnObject);
    return;
  } catch (e: any) {
    next(createHttpError(ErrorCodes.server_error, e.message));
    return;
  }
};

// delete todo
const deleteTodo = async (
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

    let { name }: JwtPayloadInterface = req.user!;

    let deleteHandler = await TodoModel.destroy({
      where: { id: todoId, userId: name },
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

//  fetch user todos
const fetchUserTodos = async (
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
    }: FetchTodoPaginationQueryInterface = req.query;

    let { name }: JwtPayloadInterface = req.user!;

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
      where: { userId: name },
      attributes: {
        exclude: ["search_vector", "userId", "index", "subTasks"],
      },
      raw: true,
    };

    if (status !== undefined && status.length > 0) {
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

//  fetch user todo details
const fetchUserTodoDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { todoId }: { todoId?: string } = req.params;

    let { name }: JwtPayloadInterface = req.user!;

    let todo = await TodoModel.findOne({
      where: { id: todoId, userId: name },
      raw: true,
      attributes: { exclude: ["userId", "index", "search_vector"] },
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

export {
  createTodo,
  deleteTodo,
  fetchUserTodoDetails,
  fetchUserTodos,
  updateTodo,
  updateTodoStatus,
};
