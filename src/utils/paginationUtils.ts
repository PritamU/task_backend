import { Order } from "sequelize";
import { SortValueTypes } from "../types/commonInterfaces";

const paginationSortHandler = (
  page?: number,
  limit?: number,
  sortField?: string,
  sortValue?: SortValueTypes
) => {
  //pagination handler
  if (!page) page = 1;
  if (!limit) limit = 10;
  let skip = (page - 1) * limit;

  //sort handler
  let sortArray: Order = [];
  if (sortField && sortValue) {
    sortArray = [[sortField, sortValue]];
  }

  return { skip, sortArray, limit, page };
};

const getHasNext = (page: number, limit: number, count: number) => {
  return page * limit < count;
};

export { getHasNext, paginationSortHandler };
