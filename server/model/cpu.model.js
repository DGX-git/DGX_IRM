const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const CPU = sequelize.define('CPU', {
    // Model attributes are defined here
    cpu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    number_of_cpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'cpu',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = CPU;