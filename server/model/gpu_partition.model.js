const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_User = require('./dgx_user.model');

const GPU_Partition = sequelize.define('GPU_Partition', {
    // Model attributes are defined here
    gpu_partition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gpu_partition: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'gpu_partition',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = GPU_Partition;