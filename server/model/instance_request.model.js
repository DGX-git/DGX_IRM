const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const GPU_Partition = require('./gpu_partition.model');
const DGX_USER = require('./dgx_user.model');
const IMAGE = require('./image.model');
const CPU = require('./cpu.model');
const Status = require('./status.model');
const GPU = require('./gpu.model');
const RAM = require('./ram.model');
const User_Type = require('./user_type.model');

const Instance_Request = sequelize.define('Instance_Request', {
    // Model attributes are defined here
    instance_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DGX_USER,
            key: 'user_id'
        }
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: IMAGE,
            key: 'image_id'
        }
    }, 
    cpu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CPU,
            key: 'cpu_id'
        }
    },
    gpu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GPU,
            key: 'gpu_id'
        }
    },
    gpu_partition_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: GPU_Partition,
            key: 'gpu_partition_id'
        }
    },
    ram_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RAM,
            key: 'ram_id'
        }
    },
    work_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Status,
            key: 'status_id'
        }
    },
    storage_volume: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_Type,
            key: 'user_type_id'
        }
    },
    login_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
     password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    access_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_access_granted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    additional_information: {
        type: DataTypes.STRING,
        allowNull: true,
    },
     created_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_timestamp: {
        type: DataTypes.DATE,
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
        allowNull: true,
        references: {
            model: DGX_USER,
            key: 'user_id'
        }
    },
    selected_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'instance_request',
    createdAt: false,
    updatedAt: false
});


module.exports = Instance_Request;