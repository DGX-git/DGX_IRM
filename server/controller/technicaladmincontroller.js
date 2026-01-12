const { get } = require('../routes/technicaladmin');
const technicaladminservice = require('../service/technicaladminservice')

const getStatus = async(request, response) => {
    technicaladminservice.getStatus(request, response);
}

const getUserInstitutes = async(request, response) => {
    technicaladminservice.getUserInstitutes(request, response);
}

const getFilteredRequests = async(request, response) => {
    technicaladminservice.getFilteredRequests(request, response);
}

const getUsers = async(request, response) => {
    technicaladminservice.getUsers(request, response);
}

const getAssociations = async(request, response) => {
    technicaladminservice.getAssociations(request, response);
}

const getInstitutes = async(request, response) => {
    technicaladminservice.getInstitutes(request, response);
}

const getTimeSlots = async(request, response) => {
    technicaladminservice.getTimeSlots(request, response);
}       

const getUserTimeSlots = async(request, response) => {
    technicaladminservice.getUserTimeSlots(request, response);
}

const updateInstanceRequest = async(request, response) => {
    technicaladminservice.updateInstanceRequest(request, response);
}

const deleteUserTimeSlots = async(request, response) => {
    technicaladminservice.deleteUserTimeSlots(request, response);
}

const getMasters = async(request, response) => {
    technicaladminservice.getMasters(request, response);
}

const approveRequest = async(request, response) => {
    technicaladminservice.approveRequest(request, response);
}

const rejectRequest = async(request, response) => {
    technicaladminservice.rejectRequest(request, response);
} 

const grantAccess = async(request, response) => {
    technicaladminservice.grantAccess(request, response);
}

const revokeAccess = async(request, response) => {
    technicaladminservice.revokeAccess(request, response);
}

module.exports =  { getStatus, getUserInstitutes, getFilteredRequests, getUsers, getAssociations, getInstitutes, getTimeSlots, getUserTimeSlots, updateInstanceRequest, deleteUserTimeSlots, getMasters, approveRequest, rejectRequest, grantAccess, revokeAccess};    