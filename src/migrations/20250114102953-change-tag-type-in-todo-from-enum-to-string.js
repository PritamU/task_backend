"use strict";

const { DataTypes, QueryInterface } = require("sequelize");

const todoTagEnum = ["personal", "work", "chores", "study", "health"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn("Todos", "tag", {
      type: DataTypes.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.changeColumn("Todos", "tag", {
      type: DataTypes.ENUM,
      values: todoTagEnum,
    });
  },
};
