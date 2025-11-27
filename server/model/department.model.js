const { Sequelize, DataTypes, Model, TIME } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Institute = require('./institute.model');

const Department = sequelize.define('Department', {
    // Model attributes are defined here
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    department_name: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    institute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Institute,
            key: 'institute_id'
          },
    }
}, {
    tableName: 'department',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Department;