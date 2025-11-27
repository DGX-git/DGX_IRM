const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_USER = require('./user_type.model');


const RAM = sequelize.define('RAM', {
    // Model attributes are defined here
    ram_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ram: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DGX_USER,
            key: 'user_id'
          },
    },
}, {
    tableName: 'ram',
    createdAt: false,
    updatedAt: false
});


module.exports = RAM;