const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const User_Type = sequelize.define('User_Type', {
    // Model attributes are defined here
    user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'user_type',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = User_Type;