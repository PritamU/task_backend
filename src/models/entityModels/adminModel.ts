import { DataTypes } from "sequelize";
import { sequelize } from "../../config/databaseConfig";
import { AdminModelInterface } from "../../types/entity/adminInterfaces";

let AdminModel = AdminModelInterface.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize: sequelize, modelName: "Admins" }
);

export { AdminModel };
