const sequelize = require('../config/sequelize.config');
const CPU  = require('../model/cpu.model');
const instancerequest = require('../model/instance_request.model');
const userType = require('../model/user_type.model');
const ram = require('../model/ram.model');
const gpu = require('../model/gpu.model');
const gpuPartition = require('../model/gpu_partition.model');
const timeSlot =  require('../model/time_slot.model');
const image = require('../model/image.model');
const cpu = require('../model/cpu.model');
const user = require('../model/dgx_user.model');
var cors = require('cors');
const { where } = require('sequelize');




// const instancerequest = async(request, response) => {
//     try {
//         // Query logic
//     } catch (error) {
//         console.error('Error during user registration:', error);
//         response.status(500).json({ error: 'Internal Server Error' });
//     }
// }


const getInstanceRequestByUserId = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let instancerequest = await sequelize.query(`SELECT * FROM instance_request WHERE user_id = ${request.body.userId}`);
            response.status(200).json(instancerequest);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getUserTypes = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let cpu = await userType.findAll();
            response.status(200).json(cpu);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getCpus = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let cpus = await cpu.findAll();
            response.status(200).json(cpus);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}


const getImages = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let images = await image.findAll();
            response.status(200).json(images);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getGpus = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let gpus = await gpu.findAll();
            response.status(200).json(gpus);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getGpuPartition = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let gpuVendors = await gpuPartition.findAll();
            response.status(200).json(gpuVendors);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getRams = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let rams = await ram.findAll();
            response.status(200).json(rams);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getTimeSlots = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let cpu = await timeSlot.findAll();
            response.status(200).json(cpu);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const getUserTimeSlotsByUserId = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let cpu = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
            response.status(200).json(cpu);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const saveInstanceRequest = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            // let instancerequest = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
            let instance_request = await instancerequest.create({
                user_id: request.body.userId,
                cpu_id: request.body.cpuId,
                gpu_id: request.body.gpuId,
                ram_id: request.body.ramId,
                gpu_vendor_id: request.body.gpuVendorId,
                time_slot_id: request.body.timeSlotId,
                additional_requirements: request.body.additionalRequirements,
                remarks: request.body.remarks,
                image_id: request.body.image_id,
                gpu_partition_id: request.body.gpu_partition_id,
                status_id: request.body.status_id,
                work_description: request.body.work_description,
                storage_volume: request.body.storage_volume,
                user_type_id: request.body.user_type_id,
                login_id: request.body.login_id,
                password: request.body.password,
                access_link: request.body.access_link,
                is_access_granted: request.body.is_access_granted,
                additional_information: request.body.additional_information,
                created_timestamp: request.body.created_timestamp,
                updated_timestamp: request.body.updated_timestamp,
                created_by: request.body.created_by,
                updated_by: request.body.updated_by,
                selected_date: request.body.selected_date
            })
            response.status(200).json(instance_request);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const updateInstanceRequest = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            // let instancerequest = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
            let instance_request = await instancerequest.update({
                user_id: request.body.userId,
                cpu_id: request.body.cpuId,
                gpu_id: request.body.gpuId,
                ram_id: request.body.ramId,
                gpu_vendor_id: request.body.gpuVendorId,
                time_slot_id: request.body.timeSlotId,
                additional_requirements: request.body.additionalRequirements,
                remarks: request.body.remarks,
                image_id: request.body.image_id,
                gpu_partition_id: request.body.gpu_partition_id,
                status_id: request.body.status_id,
                work_description: request.body.work_description,
                storage_volume: request.body.storage_volume,
                user_type_id: request.body.user_type_id,
                login_id: request.body.login_id,
                password: request.body.password,
                access_link: request.body.access_link,
                is_access_granted: request.body.is_access_granted,
                additional_information: request.body.additional_information,
                created_timestamp: request.body.created_timestamp,
                updated_timestamp: request.body.updated_timestamp,
                created_by: request.body.created_by,
                updated_by: request.body.updated_by,
                selected_date: request.body.selected_date
        }, {where:{instance_id: request.body.instanceId}})
            response.status(200).json(instance_request);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

const deleteInstanceRequest = async(request, response) => {
    sequelize.sync()
        .then(async () => {
     
            // let cpu = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
            let instancerequest = await instancerequest.destroy({where:{instance_id: request.body.instanceId}});

            response.status(200).json(instancerequest);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}



module.exports =  {instancerequest, getInstanceRequestByUserId, getUserTypes, getCpus, getImages, getGpus, getGpuPartition, getRams, getTimeSlots, getUserTimeSlotsByUserId, saveInstanceRequest, updateInstanceRequest, deleteInstanceRequest };