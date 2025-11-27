const { Sequelize, DataTypes, Model, DATEONLY } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Time_Slot = require('./time_slot.model');
const DGX_USER = require('./dgx_user.model');

const User_Time_Slot = sequelize.define('User_Time_Slot', {
    // Model attributes are defined here
    user_time_slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    instance_request_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
          },
    },
    time_slot_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Time_Slot,
            key: 'time_slot_id'
          },
    },
    selected_date:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    created_timestamp: {
        type: DataTypes.TIMESTAMP,
        allowNull: true
    },
    updated_timestamp: {
        type: DataTypes.TIMESTAMP,
        allowNull: true
    },
    created_by: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: DGX_USER, // name of Target model
            key: 'user_id', // key in Target model that we're referencing
        }
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_USER, // name of Target model
            key: 'user_id', // key in Target model that we're referencing
        }
    },
}, {
    tableName: 'user_time_slot',
    createdAt: false,
    updatedAt: false
});


module.exports = User_Time_Slot;