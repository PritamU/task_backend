import { DataTypes } from "sequelize";
import { sequelize } from "../../config/databaseConfig";
import {
  priorityEnum,
  TodoInterface,
  todoStatusEnum,
} from "../../types/metadata/todoInterfaces";
import { UserModel } from "../entityModels/userModel";

let TodoModel = TodoInterface.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: todoStatusEnum,
      allowNull: false,
      defaultValue: "pending",
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM,
      values: priorityEnum,
      allowNull: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    subTasks: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    search_vector: {
      type: "TSVECTOR",
    },
  },
  {
    sequelize: sequelize,
    modelName: "Todos",
    indexes: [
      {
        fields: ["search_vector"],
        using: "GIN",
      },
      {
        fields: ["title"],
      },
    ],
  }
);

// todo associations
TodoModel.belongsTo(UserModel, { foreignKey: "userId" });

// Add hooks to populate search_vector before save
TodoModel.beforeCreate((instance: TodoInterface) => {
  instance.search_vector = sequelize.literal(
    `to_tsvector('english', '${instance.title} ${instance.description}')`
  ) as unknown as string;
});

TodoModel.beforeUpdate((instance: TodoInterface) => {
  instance.search_vector = sequelize.literal(
    `to_tsvector('english', '${instance.title} ${instance.description} ')`
  ) as unknown as string;
});

export { TodoModel };
