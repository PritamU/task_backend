import {
  CreationOptional,
  FindAttributeOptions,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  Order,
  WhereOptions,
} from "sequelize";
import { Literal } from "sequelize/lib/utils";
import { PaginationQueryInterface } from "../commonInterfaces";

class UserModelInterface extends Model<
  InferAttributes<UserModelInterface>,
  InferCreationAttributes<UserModelInterface>
> {
  declare id: string;
  declare index: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare status: CreationOptional<boolean>;
  declare search_vector: CreationOptional<string>;
}

interface FetchUserPaginationQueryInterface extends PaginationQueryInterface {
  status?: boolean;
  searchKey?: string;
  userId?: string;
  email?: string;
}

interface FilterUserInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where: {
    id?: string;
    status?: boolean;
    email?: string;
    [Op.and]?: Array<WhereOptions<any> | Literal>;
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}

export {
  FetchUserPaginationQueryInterface,
  FilterUserInterface,
  UserModelInterface,
};
