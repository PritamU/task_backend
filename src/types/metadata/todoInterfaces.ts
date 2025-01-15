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

type PriorityTypes = "high" | "medium" | "low";
const priorityEnum = ["high", "medium", "low"];

type TodoTagTypes =
  | "personal"
  | "work"
  | "chores"
  | "study"
  | "health"
  | string;
const todoTagEnum: TodoTagTypes[] = [
  "personal",
  "work",
  "chores",
  "study",
  "health",
];

type TodoStatusTypes = "pending" | "in-progress" | "completed" | "paused";
const todoStatusEnum = ["pending", "in-progress", "completed", "paused"];

interface SubtaskInterface {
  title: string;
  status: boolean;
}

class TodoInterface extends Model<
  InferAttributes<TodoInterface>,
  InferCreationAttributes<TodoInterface>
> {
  declare id: string;
  declare userId: string;
  declare title: string;
  declare index: CreationOptional<number>;
  declare description: CreationOptional<string>;
  declare priority: PriorityTypes;
  declare tag: string;
  declare startAt: Date;
  declare subTasks: SubtaskInterface[];
  declare endAt: CreationOptional<Date>;
  declare status: CreationOptional<TodoStatusTypes>;
  declare search_vector: CreationOptional<string>;
}

interface FetchTodoPaginationQueryInterface extends PaginationQueryInterface {
  status?: TodoStatusTypes[];
  priority?: PriorityTypes;
  tag?: string;
  userId?: string;
  searchKey?: string;
}

interface FilterTodoInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where: {
    id?: string;
    status?: TodoStatusTypes[];
    priority?: PriorityTypes;
    tag?: string;
    userId?: string;
    startAt?: { [Op.gte]?: Date; [Op.lte]?: Date };
    endAt?: { [Op.gte]?: Date; [Op.lte]?: Date };
    [Op.and]?: Array<WhereOptions<any> | Literal>;
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}

export {
  FetchTodoPaginationQueryInterface,
  FilterTodoInterface,
  priorityEnum,
  PriorityTypes,
  SubtaskInterface,
  TodoInterface,
  todoStatusEnum,
  TodoStatusTypes,
  todoTagEnum,
  TodoTagTypes,
};
