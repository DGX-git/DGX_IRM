const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const DGX_User = require('./dgx_user.model');

const GPU_Partition = sequelize.define('GPU_Partition', {
    // Model attributes are defined here
    employee_store_association_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_User,
            key: 'user_id'
          },
    }
}, {
    tableName: 'gpu_partition',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = GPU_Partition;