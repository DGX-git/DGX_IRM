const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Image = sequelize.define('Image', {
    // Model attributes are defined here
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    image_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'image',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Image;