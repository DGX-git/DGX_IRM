// const sequelize = require('../config/sequelize.config');
// const CPU  = require('../model/cpu.model');
// const instancerequest = require('../model/instance_request.model');
// const userType = require('../model/user_type.model');
// const ram = require('../model/ram.model');
// const gpu = require('../model/gpu.model');
// const gpuPartition = require('../model/gpu_partition.model');
// const timeSlot =  require('../model/time_slot.model');
// const image = require('../model/image.model');
// const cpu = require('../model/cpu.model');
// const user = require('../model/dgx_user.model');
// var cors = require('cors');
// const { where } = require('sequelize');




// // const instancerequest = async(request, response) => {
// //     try {
// //         // Query logic
// //     } catch (error) {
// //         console.error('Error during user registration:', error);
// //         response.status(500).json({ error: 'Internal Server Error' });
// //     }
// // }


// const getInstanceRequestByUserId = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let instancerequest = await sequelize.query(`SELECT * FROM instance_request WHERE user_id = ${request.body.userId}`);
//             response.status(200).json(instancerequest);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getUserTypes = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let cpu = await userType.findAll();
//             response.status(200).json(cpu);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getCpus = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let cpus = await cpu.findAll();
//             response.status(200).json(cpus);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }


// const getImages = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let images = await image.findAll();
//             response.status(200).json(images);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getGpus = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let gpus = await gpu.findAll();
//             response.status(200).json(gpus);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getGpuPartition = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let gpuVendors = await gpuPartition.findAll();
//             response.status(200).json(gpuVendors);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getRams = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let rams = await ram.findAll();
//             response.status(200).json(rams);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getTimeSlots = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let cpu = await timeSlot.findAll();
//             response.status(200).json(cpu);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const getUserTimeSlotsByUserId = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let cpu = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
//             response.status(200).json(cpu);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const saveInstanceRequest = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             // let instancerequest = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
//             let instance_request = await instancerequest.create({
//                 user_id: request.body.userId,
//                 cpu_id: request.body.cpuId,
//                 gpu_id: request.body.gpuId,
//                 ram_id: request.body.ramId,
//                 gpu_vendor_id: request.body.gpuVendorId,
//                 time_slot_id: request.body.timeSlotId,
//                 additional_requirements: request.body.additionalRequirements,
//                 remarks: request.body.remarks,
//                 image_id: request.body.image_id,
//                 gpu_partition_id: request.body.gpu_partition_id,
//                 status_id: request.body.status_id,
//                 work_description: request.body.work_description,
//                 storage_volume: request.body.storage_volume,
//                 user_type_id: request.body.user_type_id,
//                 login_id: request.body.login_id,
//                 password: request.body.password,
//                 access_link: request.body.access_link,
//                 is_access_granted: request.body.is_access_granted,
//                 additional_information: request.body.additional_information,
//                 created_timestamp: request.body.created_timestamp,
//                 updated_timestamp: request.body.updated_timestamp,
//                 created_by: request.body.created_by,
//                 updated_by: request.body.updated_by,
//                 selected_date: request.body.selected_date
//             })
//             response.status(200).json(instance_request);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const updateInstanceRequest = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             // let instancerequest = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
//             let instance_request = await instancerequest.update({
//                 user_id: request.body.userId,
//                 cpu_id: request.body.cpuId,
//                 gpu_id: request.body.gpuId,
//                 ram_id: request.body.ramId,
//                 gpu_vendor_id: request.body.gpuVendorId,
//                 time_slot_id: request.body.timeSlotId,
//                 additional_requirements: request.body.additionalRequirements,
//                 remarks: request.body.remarks,
//                 image_id: request.body.image_id,
//                 gpu_partition_id: request.body.gpu_partition_id,
//                 status_id: request.body.status_id,
//                 work_description: request.body.work_description,
//                 storage_volume: request.body.storage_volume,
//                 user_type_id: request.body.user_type_id,
//                 login_id: request.body.login_id,
//                 password: request.body.password,
//                 access_link: request.body.access_link,
//                 is_access_granted: request.body.is_access_granted,
//                 additional_information: request.body.additional_information,
//                 created_timestamp: request.body.created_timestamp,
//                 updated_timestamp: request.body.updated_timestamp,
//                 created_by: request.body.created_by,
//                 updated_by: request.body.updated_by,
//                 selected_date: request.body.selected_date
//         }, {where:{instance_id: request.body.instanceId}})
//             response.status(200).json(instance_request);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// const deleteInstanceRequest = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
     
//             // let cpu = await sequelize.query(`SELECT uts.* FROM user_time_slots uts WHERE uts.user_id = ${request.body.userId}`);
//             let instancerequest = await instancerequest.destroy({where:{instance_id: request.body.instanceId}});

//             response.status(200).json(instancerequest);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }



// module.exports =  {instancerequest, getInstanceRequestByUserId, getUserTypes, getCpus, getImages, getGpus, getGpuPartition, getRams, getTimeSlots, getUserTimeSlotsByUserId, saveInstanceRequest, updateInstanceRequest, deleteInstanceRequest };




// UPDATED instancerequestservice.js

const sequelize = require('../config/sequelize.config');
const CPU = require('../model/cpu.model');
const InstanceRequest = require('../model/instance_request.model');
const UserType = require('../model/user_type.model');
const RAM = require('../model/ram.model');
const GPU = require('../model/gpu.model');
const GPUPartition = require('../model/gpu_partition.model');
const TimeSlot = require('../model/time_slot.model');
const Image = require('../model/image.model');
const Status = require('../model/status.model');
const User = require('../model/dgx_user.model');
const UserTimeSlot = require('../model/user_time_slot.model');
const { Op } = require('sequelize');

// ============== EXISTING FUNCTIONS ==============

const getInstanceRequestByUserId = async(request, response) => {
    try {
        await sequelize.sync();
        const userId = request.body.userId;
        const instanceRequests = await InstanceRequest.findAll({
            where: { user_id: userId }
        });
        response.status(200).json(instanceRequests);
    } catch (error) {
        console.error('Error fetching instance requests by user ID:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserTypes = async(request, response) => {
    try {
        await sequelize.sync();
        const userTypes = await UserType.findAll();
        response.status(200).json(userTypes);
    } catch (error) {
        console.error('Error fetching user types:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCpus = async(request, response) => {
    try {
        await sequelize.sync();
        const cpus = await CPU.findAll();
        response.status(200).json(cpus);
    } catch (error) {
        console.error('Error fetching CPUs:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getImages = async(request, response) => {
    try {
        await sequelize.sync();
        const images = await Image.findAll();
        response.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getGpus = async(request, response) => {
    try {
        await sequelize.sync();
        const gpus = await GPU.findAll();
        response.status(200).json(gpus);
    } catch (error) {
        console.error('Error fetching GPUs:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getGpuPartition = async(request, response) => {
    try {
        await sequelize.sync();
        const gpuPartitions = await GPUPartition.findAll();
        response.status(200).json(gpuPartitions);
    } catch (error) {
        console.error('Error fetching GPU partitions:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getRams = async(request, response) => {
    try {
        await sequelize.sync();
        const rams = await RAM.findAll();
        response.status(200).json(rams);
    } catch (error) {
        console.error('Error fetching RAM:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTimeSlots = async(request, response) => {
    try {
        await sequelize.sync();
        const timeSlots = await TimeSlot.findAll();
        response.status(200).json(timeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserTimeSlotsByUserId = async(request, response) => {
    try {
        await sequelize.sync();
        const userId = request.body.userId;
        const userTimeSlots = await UserTimeSlot.findAll({
            where: { user_id: userId }
        });
        response.status(200).json(userTimeSlots);
    } catch (error) {
        console.error('Error fetching user time slots:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

// ============== NEW RESTful FUNCTIONS ==============

// Get single instance request by ID
const getInstanceRequestById = async(request, response) => {
    try {
        await sequelize.sync();
        const instanceId = request.params.id;
        const instanceRequest = await InstanceRequest.findByPk(instanceId);
        
        if (!instanceRequest) {
            return response.status(404).json({ error: 'Instance request not found' });
        }
        
        response.status(200).json(instanceRequest);
    } catch (error) {
        console.error('Error fetching instance request:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create new instance request
// const createInstanceRequest = async(request, response) => {
//     try {
//         await sequelize.sync();
        
//         const {
//             user_id,
//             cpu_id,
//             gpu_id,
//             ram_id,
//             gpu_vendor_id,
//             gpu_partition_id,
//             image_id,
//             status_id,
//             work_description,
//             storage_volume,
//             user_type_id,
//             login_id,
//             password,
//             access_link,
//             is_access_granted,
//             additional_information,
//             remarks,
//             selected_date,
//             created_by,
//             updated_by
//         } = request.body;

//         const newInstanceRequest = await InstanceRequest.create({
//             user_id,
//             cpu_id,
//             gpu_id: gpu_id || null,
//             ram_id,
//             gpu_vendor_id: gpu_vendor_id || null,
//             gpu_partition_id,
//             image_id,
//             status_id: status_id || 1,
//             work_description,
//             storage_volume: storage_volume || 10,
//             user_type_id,
//             login_id: login_id || '',
//             password: password || '',
//             access_link: access_link || '',
//             is_access_granted: is_access_granted || false,
//             additional_inforamation: additional_information || '',
//             remarks: remarks || '',
//             time_slot: selected_date || '',
//             created_timestamp: new Date(),
//             updated_timestamp: new Date(),
//             created_by: created_by || user_id,
//             updated_by: updated_by || user_id
//         });

//         response.status(201).json(newInstanceRequest);
//     } catch (error) {
//         console.error('Error creating instance request:', error);
//         response.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// };




// Create new instance request
const createInstanceRequest = async(request, response) => {
    try {
        await sequelize.sync();
        
        const {
            user_id,
            cpu_id,
            gpu_id,
            ram_id,
            gpu_vendor_id,
            gpu_partition_id,
            image_id,
            status_id,
            work_description,
            storage_volume,
            user_type_id,
            login_id,
            password,
            access_link,
            is_access_granted,
            additional_information,
            remarks,
            selected_date,
            created_by,
            updated_by
        } = request.body;

        // Validate required fields
        if (!user_id) {
            return response.status(400).json({ error: 'user_id is required' });
        }
        if (!cpu_id) {
            return response.status(400).json({ error: 'cpu_id is required' });
        }
        if (!ram_id) {
            return response.status(400).json({ error: 'ram_id is required' });
        }
        if (!image_id) {
            return response.status(400).json({ error: 'image_id is required' });
        }
        if (!user_type_id) {
            return response.status(400).json({ error: 'user_type_id is required' });
        }

        const newInstanceRequest = await InstanceRequest.create({
            user_id: user_id,
            cpu_id: cpu_id,
            gpu_id: gpu_id || 1, // Provide a default gpu_id since it's required
            ram_id: ram_id,
            gpu_vendor_id: gpu_vendor_id || null,
            gpu_partition_id: gpu_partition_id || null,
            image_id: image_id,
            status_id: status_id || 1,
            work_description: work_description || '',
            storage_volume: storage_volume || 10,
            user_type_id: user_type_id,
            login_id: login_id || 'pending', // Cannot be empty
            password: password || 'pending', // Cannot be empty
            access_link: access_link || '',
            is_access_granted: is_access_granted || false,
            additional_inforamation: additional_information || '',
            remarks: remarks || '',
            time_slot: selected_date || '',
            created_timestamp: new Date(),
            updated_timestamp: new Date(),
            created_by: created_by || user_id || 1,
            updated_by: updated_by || user_id || 1
        });

        response.status(201).json(newInstanceRequest);
    } catch (error) {
        console.error('Error creating instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Update instance request by ID
// const updateInstanceRequestById = async(request, response) => {
//     try {
//         await sequelize.sync();
//         const instanceId = request.params.id;
        
//         const instanceRequest = await InstanceRequest.findByPk(instanceId);
//         if (!instanceRequest) {
//             return response.status(404).json({ error: 'Instance request not found' });
//         }

//         const {
//             user_id,
//             cpu_id,
//             gpu_id,
//             ram_id,
//             gpu_vendor_id,
//             gpu_partition_id,
//             image_id,
//             status_id,
//             work_description,
//             storage_volume,
//             user_type_id,
//             login_id,
//             password,
//             access_link,
//             is_access_granted,
//             additional_information,
//             remarks,
//             selected_date,
//             updated_by
//         } = request.body;

//         await instanceRequest.update({
//             user_id: user_id || instanceRequest.user_id,
//             cpu_id: cpu_id || instanceRequest.cpu_id,
//             gpu_id: gpu_id || instanceRequest.gpu_id,
//             ram_id: ram_id || instanceRequest.ram_id,
//             gpu_vendor_id: gpu_vendor_id || instanceRequest.gpu_vendor_id,
//             gpu_partition_id: gpu_partition_id || instanceRequest.gpu_partition_id,
//             image_id: image_id || instanceRequest.image_id,
//             status_id: status_id || instanceRequest.status_id,
//             work_description: work_description || instanceRequest.work_description,
//             storage_volume: storage_volume || instanceRequest.storage_volume,
//             user_type_id: user_type_id || instanceRequest.user_type_id,
//             login_id: login_id || instanceRequest.login_id,
//             password: password || instanceRequest.password,
//             access_link: access_link || instanceRequest.access_link,
//             is_access_granted: is_access_granted !== undefined ? is_access_granted : instanceRequest.is_access_granted,
//             additional_inforamation: additional_information || instanceRequest.additional_inforamation,
//             remarks: remarks || instanceRequest.remarks,
//             time_slot: selected_date || instanceRequest.time_slot,
//             updated_timestamp: new Date(),
//             updated_by: updated_by || instanceRequest.updated_by
//         });

//         response.status(200).json(instanceRequest);
//     } catch (error) {
//         console.error('Error updating instance request:', error);
//         response.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// };







// Update instance request by ID
const updateInstanceRequestById = async(request, response) => {
    try {
        await sequelize.sync();
        const instanceId = request.params.id;
        
        const instanceRequest = await InstanceRequest.findByPk(instanceId);
        if (!instanceRequest) {
            return response.status(404).json({ error: 'Instance request not found' });
        }

        const {
            user_id,
            cpu_id,
            gpu_id,
            ram_id,
            gpu_vendor_id,
            gpu_partition_id,
            image_id,
            status_id,
            work_description,
            storage_volume,
            user_type_id,
            login_id,
            password,
            access_link,
            is_access_granted,
            additional_information,
            remarks,
            selected_date,
            updated_by
        } = request.body;

        await instanceRequest.update({
            user_id: user_id || instanceRequest.user_id,
            cpu_id: cpu_id || instanceRequest.cpu_id,
            gpu_id: gpu_id || instanceRequest.gpu_id,
            ram_id: ram_id || instanceRequest.ram_id,
            gpu_vendor_id: gpu_vendor_id || instanceRequest.gpu_vendor_id,
            gpu_partition_id: gpu_partition_id || instanceRequest.gpu_partition_id,
            image_id: image_id || instanceRequest.image_id,
            status_id: status_id || instanceRequest.status_id,
            work_description: work_description !== undefined ? work_description : instanceRequest.work_description,
            storage_volume: storage_volume || instanceRequest.storage_volume,
            user_type_id: user_type_id || instanceRequest.user_type_id,
            login_id: login_id || instanceRequest.login_id,
            password: password || instanceRequest.password,
            access_link: access_link || instanceRequest.access_link,
            is_access_granted: is_access_granted !== undefined ? is_access_granted : instanceRequest.is_access_granted,
            additional_inforamation: additional_information || instanceRequest.additional_inforamation,
            remarks: remarks || instanceRequest.remarks,
            time_slot: selected_date || instanceRequest.time_slot,
            updated_timestamp: new Date(),
            updated_by: updated_by || instanceRequest.updated_by
        });

        response.status(200).json(instanceRequest);
    } catch (error) {
        console.error('Error updating instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};





// Delete instance request by ID
const deleteInstanceRequestById = async(request, response) => {
    try {
        await sequelize.sync();
        const instanceId = request.params.id;
        
        const instanceRequest = await InstanceRequest.findByPk(instanceId);
        if (!instanceRequest) {
            return response.status(404).json({ error: 'Instance request not found' });
        }

        await instanceRequest.destroy();
        response.status(200).json({ message: 'Instance request deleted successfully' });
    } catch (error) {
        console.error('Error deleting instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// ============== USER TIME SLOTS FUNCTIONS ==============

// Get user time slots with filters
const getUserTimeSlots = async(request, response) => {
    try {
        await sequelize.sync();
        
        const { selectedDate, instanceRequestId, excludeInstanceId } = request.query;
        const whereClause = {};

        if (selectedDate) {
            whereClause.selected_date = selectedDate;
        }

        if (instanceRequestId) {
            whereClause.instance_request_id = instanceRequestId;
        } else if (excludeInstanceId) {
            whereClause.instance_request_id = {
                [Op.ne]: excludeInstanceId
            };
        }

        const userTimeSlots = await UserTimeSlot.findAll({
            where: whereClause
        });

        response.status(200).json(userTimeSlots);
    } catch (error) {
        console.error('Error fetching user time slots:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Bulk insert user time slots
const saveUserTimeSlotsBulk = async(request, response) => {
    try {
        await sequelize.sync();
        
        const { timeSlots } = request.body;
        
        if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
            return response.status(400).json({ error: 'Invalid timeSlots array' });
        }

        const createdSlots = await UserTimeSlot.bulkCreate(
            timeSlots.map(slot => ({
                instance_request_id: slot.instance_request_id,
                time_slot_id: slot.time_slot_id,
                selected_date: slot.selected_date,
                created_timestamp: new Date(),
                updated_timestamp: new Date(),
                created_by: slot.created_by || 1,
                updated_by: slot.updated_by || 1
            }))
        );

        response.status(201).json(createdSlots);
    } catch (error) {
        console.error('Error saving user time slots:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Delete user time slots with filters
const deleteUserTimeSlotsByFilter = async(request, response) => {
    try {
        await sequelize.sync();
        
        const { instanceRequestId } = request.query;
        const whereClause = {};

        if (instanceRequestId) {
            whereClause.instance_request_id = instanceRequestId;
        } else {
            return response.status(400).json({ error: 'instanceRequestId is required' });
        }

        const deletedCount = await UserTimeSlot.destroy({
            where: whereClause
        });

        response.status(200).json({ 
            message: 'Time slots deleted successfully',
            deletedCount: deletedCount
        });
    } catch (error) {
        console.error('Error deleting user time slots:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Check time slot conflicts
const checkTimeSlotConflicts = async(request, response) => {
    try {
        await sequelize.sync();
        
        const { date, instanceId } = request.query;
        
        if (!date) {
            return response.status(400).json({ error: 'date parameter is required' });
        }

        const whereClause = {
            selected_date: date
        };

        if (instanceId) {
            whereClause.instance_request_id = {
                [Op.ne]: instanceId
            };
        }

        const conflicts = await UserTimeSlot.findAll({
            where: whereClause,
            attributes: ['time_slot_id', 'instance_request_id']
        });

        response.status(200).json(conflicts);
    } catch (error) {
        console.error('Error checking time slot conflicts:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// ============== EXISTING SAVE/UPDATE/DELETE FUNCTIONS ==============

const saveInstanceRequest = async(request, response) => {
    try {
        await sequelize.sync();
        
        const newInstanceRequest = await InstanceRequest.create({
            user_id: request.body.user_id,
            cpu_id: request.body.cpu_id,
            gpu_id: request.body.gpu_id,
            ram_id: request.body.ram_id,
            gpu_vendor_id: request.body.gpu_vendor_id,
            time_slot_id: request.body.time_slot_id,
            additional_requirements: request.body.additional_requirements,
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
            additional_inforamation: request.body.additional_information,
            created_timestamp: new Date(),
            updated_timestamp: new Date(),
            created_by: request.body.created_by,
            updated_by: request.body.updated_by,
            time_slot: request.body.selected_date
        });

        response.status(200).json(newInstanceRequest);
    } catch (error) {
        console.error('Error saving instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const updateInstanceRequest = async(request, response) => {
    try {
        await sequelize.sync();
        
        const updated = await InstanceRequest.update({
            user_id: request.body.user_id,
            cpu_id: request.body.cpu_id,
            gpu_id: request.body.gpu_id,
            ram_id: request.body.ram_id,
            gpu_vendor_id: request.body.gpu_vendor_id,
            time_slot_id: request.body.time_slot_id,
            additional_requirements: request.body.additional_requirements,
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
            additional_inforamation: request.body.additional_information,
            updated_timestamp: new Date(),
            updated_by: request.body.updated_by,
            time_slot: request.body.selected_date
        }, {
            where: { instance_request_id: request.body.instance_id }
        });

        response.status(200).json(updated);
    } catch (error) {
        console.error('Error updating instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const deleteInstanceRequest = async(request, response) => {
    try {
        await sequelize.sync();
        
        const deleted = await InstanceRequest.destroy({
            where: { instance_request_id: request.body.instance_id }
        });

        response.status(200).json({ 
            message: 'Instance request deleted',
            deletedCount: deleted
        });
    } catch (error) {
        console.error('Error deleting instance request:', error);
        response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = {
    // Existing functions
    getInstanceRequestByUserId,
    getUserTypes,
    getCpus,
    getImages,
    getGpus,
    getGpuPartition,
    getRams,
    getTimeSlots,
    getUserTimeSlotsByUserId,
    saveInstanceRequest,
    updateInstanceRequest,
    deleteInstanceRequest,
    
    // New RESTful functions
    getInstanceRequestById,
    createInstanceRequest,
    updateInstanceRequestById,
    deleteInstanceRequestById,
    
    // User time slots functions
    getUserTimeSlots,
    saveUserTimeSlotsBulk,
    deleteUserTimeSlotsByFilter,
    checkTimeSlotConflicts
};