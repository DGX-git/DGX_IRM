const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_USER = require('./dgx_user.model');

const DGX_USER = sequelize.define('DGX_USER', {
    // Model attributes are defined here
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    contact_no: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_timestamp: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
    },
    updated_timestamp: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
        }
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
        }
    }
}, {
    tableName: 'dgx_user',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = DGX_USER;