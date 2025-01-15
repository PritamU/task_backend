import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ErrorCodes } from "../../constants/errorCodes";
import {
  arrayValidate,
  enumValidate,
  intValidate,
  objectValidate,
  stringValidate,
} from "./fieldValidations";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    return next(createHttpError(ErrorCodes.validation_failed, errorMessage));
  }
  next();
};

const basicPaginationHandler = () => {
  return [
    intValidate("query", "page", true)!,
    intValidate("query", "limit", true)!,
    stringValidate("query", "sortField", true)!,
    enumValidate("query", "sortValue", true, ["ASC", "DESC"])!,
  ];
};

const contentValidationHandler = (fieldName: string) => {
  return [
    arrayValidate("body", fieldName, true),
    objectValidate("body", `${fieldName}.*`, true),
    stringValidate("body", `${fieldName}.*.title`, false),
    stringValidate("body", `${fieldName}.*.content`, true),
  ];
};

const arrayOfStringsPaginationHandler = (field: string) => {
  return (
    arrayValidate("body", field, false)
      ?.isArray()
      .withMessage(`${field} is empty!`),
    stringValidate("query", `${field}.*`, false)
  );
};

const contentPaginationHandler = (field: string) => {
  return (
    arrayValidate("body", field, false)
      ?.isArray()
      .withMessage(`${field} is empty!`),
    objectValidate("query", `${field}.*`, false),
    stringValidate("query", `${field}.*.title`, false),
    stringValidate("query", `${field}.*.content`, true)
  );
};

const convertStringToArrayOfStrings = (value: string) => {
  return value?.split(",");
};

const convertStringifiedArrayToJsonArray = (value: string) => {
  if (value) {
    return JSON.parse(value);
  }
};

export {
  arrayOfStringsPaginationHandler,
  basicPaginationHandler,
  contentPaginationHandler,
  contentValidationHandler,
  convertStringifiedArrayToJsonArray,
  convertStringToArrayOfStrings,
  validationHandler,
};
