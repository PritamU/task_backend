import { DataTypes } from "sequelize";
import { sequelize } from "../../config/databaseConfig";
import { UserModelInterface } from "../../types/entity/userInterfaces";

let UserModel = UserModelInterface.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    index: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email: {
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
    search_vector: {
      type: "TSVECTOR",
    },
  },
  {
    sequelize: sequelize,
    modelName: "Users",
    indexes: [
      {
        fields: ["search_vector"],
        using: "GIN",
      },
      {
        fields: ["name"],
      },
    ],
  }
);

// Add hooks to populate search_vector before save
UserModel.beforeCreate((instance: UserModelInterface) => {
  instance.search_vector = sequelize.literal(
    `to_tsvector('english', '${instance.name} ${instance.email}')`
  ) as unknown as string;
});

UserModel.beforeUpdate((instance: UserModelInterface) => {
  instance.search_vector = sequelize.literal(
    `to_tsvector('english', '${instance.name} ${instance.email} ')`
  ) as unknown as string;
});

export { UserModel };
