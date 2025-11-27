const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Role = sequelize.define('Role', {
    // Model attributes are defined here
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'role',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Role;