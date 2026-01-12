// const instancerequestservice = require('../service/instancerequestservice')

// const instancerequest = async(request, response) => {
//     instancerequestservice.getCpus(request, response);
// }

// const getInstanceRequestByUserId = async(request, response) => {
//     instancerequestservice.getInstanceRequestByUserId(request, response);
// }

// const getUserTypes = async(request, response) => {
//     instancerequestservice.getUserTypes(request, response);
// }

// const getCpus = async(request, response) => {
//     instancerequestservice.getCpus(request, response);
// }

// const getImages = async(request, response) => {
//     instancerequestservice.getImages(request, response);
// }

// const getGpus = async(request, response) => {
//     instancerequestservice.getGpus(request, response);
// }

// const getGpuPartition = async(request, response) => {
//     instancerequestservice.getGpuPartition(request, response);
// }

// const getRams = async(request, response) => {
//     instancerequestservice.getRams(request, response);
// }

// const getTimeSlots = async(request, response) => {
//     instancerequestservice.getTimeSlots(request, response);
// }


// const getUserTimeSlotsByUserId = async(request, response) => {
//     instancerequestservice.getUserTimeSlotsByUserId(request, response);
// }

// const saveInstanceRequest = async(request, response) => {
//     instancerequestservice.saveInstanceRequest(request, response);
// }

// const updateInstanceRequest = async(request, response) => {
//     instancerequestservice.updateInstanceRequest(request, response);
// }

// const deleteInstanceRequest = async(request, response) => {
//     instancerequestservice.deleteInstanceRequest(request, response);
// }




// module.exports =  {instancerequest, getInstanceRequestByUserId, getUserTypes, getCpus, getImages, getGpus, getGpuPartition, getRams, getTimeSlots, getUserTimeSlotsByUserId, saveInstanceRequest, updateInstanceRequest, deleteInstanceRequest };





const instancerequestservice = require('../service/instancerequestservice');

const instancerequest = async(request, response) => {
    instancerequestservice.getCpus(request, response);
};

const getInstanceRequestByUserId = async(request, response) => {
    instancerequestservice.getInstanceRequestByUserId(request, response);
};

const getUserTypes = async(request, response) => {
    instancerequestservice.getUserTypes(request, response);
};

const getCpus = async(request, response) => {
    instancerequestservice.getCpus(request, response);
};

const getImages = async(request, response) => {
    instancerequestservice.getImages(request, response);
};

const getGpus = async(request, response) => {
    instancerequestservice.getGpus(request, response);
};

const getGpuPartition = async(request, response) => {
    instancerequestservice.getGpuPartition(request, response);
};

const getRams = async(request, response) => {
    instancerequestservice.getRams(request, response);
};

const getTimeSlots = async(request, response) => {
    instancerequestservice.getTimeSlots(request, response);
};

const getUserTimeSlotsByUserId = async(request, response) => {
    instancerequestservice.getUserTimeSlotsByUserId(request, response);
};

const saveInstanceRequest = async(request, response) => {
    instancerequestservice.saveInstanceRequest(request, response);
};

const updateInstanceRequest = async(request, response) => {
    instancerequestservice.updateInstanceRequest(request, response);
};

const deleteInstanceRequest = async(request, response) => {
    instancerequestservice.deleteInstanceRequest(request, response);
};

// New RESTful controllers
const getInstanceRequestById = async(request, response) => {
    instancerequestservice.getInstanceRequestById(request, response);
};

const createInstanceRequest = async(request, response) => {
    instancerequestservice.createInstanceRequest(request, response);
};

const updateInstanceRequestById = async(request, response) => {
    instancerequestservice.updateInstanceRequestById(request, response);
};

const deleteInstanceRequestById = async(request, response) => {
    instancerequestservice.deleteInstanceRequestById(request, response);
};

// User time slots controllers
const getUserTimeSlots = async(request, response) => {
    instancerequestservice.getUserTimeSlots(request, response);
};

const saveUserTimeSlotsBulk = async(request, response) => {
    instancerequestservice.saveUserTimeSlotsBulk(request, response);
};

const deleteUserTimeSlotsByFilter = async(request, response) => {
    instancerequestservice.deleteUserTimeSlotsByFilter(request, response);
};

const checkTimeSlotConflicts = async(request, response) => {
    instancerequestservice.checkTimeSlotConflicts(request, response);
};

module.exports = {
    instancerequest,
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
    getInstanceRequestById,
    createInstanceRequest,
    updateInstanceRequestById,
    deleteInstanceRequestById,
    getUserTimeSlots,
    saveUserTimeSlotsBulk,
    deleteUserTimeSlotsByFilter,
    checkTimeSlotConflicts
};