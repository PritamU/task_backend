import express from "express";
import { query } from "express-validator";
import {
  deleteTodoByAdmin,
  fetchTodoDetailsByAdmin,
  fetchTodosByAdmin,
} from "../../controllers/metadataControllers/todoControllers/adminTodoControllers";
import {
  createTodo,
  deleteTodo,
  fetchUserTodoDetails,
  fetchUserTodos,
  updateTodo,
  updateTodoStatus,
} from "../../controllers/metadataControllers/todoControllers/userTodoControllers";
import { adminAuthMiddleware } from "../../middlewares/validators/auth/adminAuthMiddleware";
import { userAuthMiddleware } from "../../middlewares/validators/auth/userAuthMiddleware";
import {
  arrayValidate,
  booleanValidate,
  enumValidate,
  objectValidate,
  stringValidate,
} from "../../middlewares/validators/fieldValidations";
import {
  basicPaginationHandler,
  convertStringToArrayOfStrings,
  validationHandler,
} from "../../middlewares/validators/validationHandler";
import {
  priorityEnum,
  todoStatusEnum,
} from "../../types/metadata/todoInterfaces";

let router = express.Router();

// create todo
router.post(
  "",
  [
    stringValidate("body", "title", false)!,
    stringValidate("body", "description", true)!,
    enumValidate("body", "priority", false, priorityEnum)!,
    stringValidate("body", "tag", false)!,
    stringValidate("body", "startAt", false)!,
    stringValidate("body", "endAt", true)!,
    arrayValidate("body", "subTasks", true)!,
    objectValidate("body", "subTasks.*", true)!,
    stringValidate("body", "subTasks.*.title", true)!,
    booleanValidate("body", "subTasks.*.status", true)!,
  ],
  validationHandler,
  userAuthMiddleware,
  createTodo
);

// update todo
router.patch(
  "",
  [
    stringValidate("body", "todoId", false)!,
    stringValidate("body", "title", true)!,
    stringValidate("body", "description", true)!,
    enumValidate("body", "priority", true, priorityEnum)!,
    stringValidate("body", "tag", true)!,
    stringValidate("body", "startAt", true)!,
    stringValidate("body", "endAt", true)!,
    arrayValidate("body", "subTasks", true)!,
    objectValidate("body", "subTasks.*", true)!,
    stringValidate("body", "subTasks.*.title", true)!,
    booleanValidate("body", "subTasks.*.status", true)!,
  ],
  validationHandler,
  userAuthMiddleware,
  updateTodo
);

// update todo status
router.patch(
  "/status",
  [
    stringValidate("body", "todoId", false)!,
    enumValidate("body", "status", false, [
      "in-progress",
      "paused",
      "completed",
    ])!,
  ],
  validationHandler,
  userAuthMiddleware,
  updateTodoStatus
);

// delete todo by user
router.delete(
  "",
  [stringValidate("body", "todoId", false)!],
  validationHandler,
  userAuthMiddleware,
  deleteTodo
);

// fetch user todos
router.get(
  "",
  [
    ...basicPaginationHandler(),
    query("status").customSanitizer(convertStringToArrayOfStrings),
    arrayValidate("query", "status", true)!,
    enumValidate("query", "status.*", true, todoStatusEnum)!,
    enumValidate("query", "priority", true, priorityEnum)!,
    stringValidate("query", "tag", true)!,
    stringValidate("query", "searchKey", true)!,
  ],
  validationHandler,
  userAuthMiddleware,
  fetchUserTodos
);

// fetch user todo details
router.get(
  "/details/:todoId",
  [stringValidate("param", "todoId", false)!],
  validationHandler,
  userAuthMiddleware,
  fetchUserTodoDetails
);

// fetch todos by admin
router.get(
  "/fetch-by-admin",
  [
    ...basicPaginationHandler(),
    enumValidate("query", "status", true, todoStatusEnum)!,
    enumValidate("query", "priority", true, priorityEnum)!,
    stringValidate("query", "tag", true)!,
    stringValidate("query", "userId", true)!,
    stringValidate("query", "searchKey", true)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  fetchTodosByAdmin
);

// fetch todo details by admin
router.get(
  "/fetch-by-admin/details/:todoId",
  [stringValidate("param", "todoId", false)!],
  validationHandler,
  adminAuthMiddleware,
  fetchTodoDetailsByAdmin
);

// delete todo by admin
router.delete(
  "/delete-by-admin",
  [stringValidate("body", "todoId", false)!],
  validationHandler,
  adminAuthMiddleware,
  deleteTodoByAdmin
);

export default router;
