const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");
const DGX_USER = require("./dgx_user.model");
const Institute = require("./institute.model");
const Department = require("./department.model");

const User_Institute_Association = sequelize.define(
  "User_Institute_Association",
  {
    // Model attributes are defined here
    user_institute_association_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DGX_USER, // name of Target model
        key: "user_id", // key in Target model that we're referencing
      },
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Institute, // name of Target model
        key: "institute_id", // key in Target model that we're referencing
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department, // name of Target model
        key: "department_id", // key in Target model that we're referencing
      },
    },
    created_timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.NUMBER,
      allowNull: true,
      references: {
        model: DGX_USER, // name of Target model
        key: "user_id", // key in Target model that we're referencing
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DGX_USER, // name of Target model
        key: "user_id", // key in Target model that we're referencing
      },
    },
    is_reg_institute: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "user_institute_association",
    createdAt: false,
    updatedAt: false,
    // Other model options go here
  }
);

module.exports = User_Institute_Association;
