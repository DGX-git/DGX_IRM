const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Institute = sequelize.define('Institute', {
    // Model attributes are defined here
    institute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    institute_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'institute',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Institute;