import {
  CreationOptional,
  FindAttributeOptions,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Order,
} from "sequelize";
import { PaginationQueryInterface } from "../commonInterfaces";

class AdminModelInterface extends Model<
  InferAttributes<AdminModelInterface>,
  InferCreationAttributes<AdminModelInterface>
> {
  declare id: string;
  declare name: string;
  declare username: string;
  declare password: string;
  declare status: CreationOptional<boolean>;
  declare isPrimary: boolean;
}

interface FetchAdminPaginationQueryInterface extends PaginationQueryInterface {
  isPrimary?: boolean;
  status?: boolean;
}

interface FilterAdminInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where?: {
    status?: boolean;
    isPrimary?: boolean;
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}

export {
  AdminModelInterface,
  FetchAdminPaginationQueryInterface,
  FilterAdminInterface,
};
