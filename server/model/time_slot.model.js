const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Time_Slot = sequelize.define('Time_Slot', {
    // Model attributes are defined here
    time_slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    time_slot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'time_slot',
    createdAt: false,
    updatedAt: false
});


module.exports = Time_Slot;