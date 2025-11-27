const database_config = require('./db.config');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(
    database_config.DATABASE,
    database_config.USER,
    database_config.PASSWORD, {
    host: database_config.HOST,
    dialect: database_config.DIALECT,
    port: database_config.PORT,
    logging: console.log,
}
);

module.exports = sequelize;