const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_USER = require('./dgx_user.model');


const GPU = sequelize.define('GPU', {
    // Model attributes are defined here
    gpu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gpu_vendor: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
          },
    }
}, {
    tableName: 'gpu',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = GPU;