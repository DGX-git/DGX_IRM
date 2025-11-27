const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_USER = require('./dgx_user.model');

const OTP = sequelize.define('OTP', {
    // Model attributes are defined here
    otp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
        }
    },
    created_timestamp: {
        type: DataTypes.TIMESTAMP,
        allowNull: true
    }
}, {
    tableName: 'otp',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = OTP;