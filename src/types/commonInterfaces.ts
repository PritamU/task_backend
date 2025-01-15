import { Request } from "express";

type SortValueTypes = "ASC" | "DESC";
const sortValueEnum = ["ASC", "DESC"];

interface PaginationQueryInterface {
  page?: number;
  limit?: number;
  sortField?: string;
  sortValue?: SortValueTypes;
}

interface BasicResponseInterface {
  status: boolean;
  message: string;
}

interface BasicDataResponseInterface<DataType> {
  status: boolean;
  data: DataType;
}

interface PaginatedQueryResponseDataInterface<DataType> {
  hasNext: boolean;
  count: number;
  data: DataType[];
}

interface JwtPayloadInterface {
  name: string;
  isPrimary: boolean;
  exp?: number;
}

interface CustomRequest extends Request {
  user?: JwtPayloadInterface;
}

export {
  BasicDataResponseInterface,
  BasicResponseInterface,
  CustomRequest,
  JwtPayloadInterface,
  PaginatedQueryResponseDataInterface,
  PaginationQueryInterface,
  sortValueEnum,
  SortValueTypes,
};
