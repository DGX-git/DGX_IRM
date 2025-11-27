const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Status = sequelize.define('Status', {
    // Model attributes are defined here
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    status_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'status',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Status;