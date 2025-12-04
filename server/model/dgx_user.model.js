const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');


const DGX_USER = sequelize.define('DGX_USER', {
    // Model attributes are defined here
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
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
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },  
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }  
},
 {
    tableName: 'dgx_user',
    createdAt: false,
    updatedAt: false
    // Other model options go here
}
);


module.exports = DGX_USER;