const profileservice = require("../service/profileservice");

const profile = async (request, response) => {
  profileservice.getUserProfile(request, response);
};

const roleById = async (request, response) => {
  profileservice.getRoleById(request, response);
};

const getDepartments = async (request, response) => {
  profileservice.getDepartments(request, response);
};

const getInstitutes = async (request, response) => {
  profileservice.getInstitutes(request, response);
};

const getDepartmentById = async (request, response) => {
  profileservice.getDepartmentById(request, response);
};

const getInstituteById = async (request, response) => {
  profileservice.getInstituteById(request, response);
};

const getAuthUser = async (request, response) => {
  profileservice.getAuthUser(request, response);
};
const getUserAssociations = async (request, response) => {
  profileservice.getUserAssociations(request, response);
};
const updateProfile = async (request, response) => {
  profileservice.updateProfile(request, response);
};

const updateAuthUser = async (request, response) => {
  profileservice.updateAuthUser(request, response);
};

const updateAssociation = async (request, response) => {
  profileservice.updateAssociation(request, response);
};

module.exports = {
  profile,
  roleById,
  getInstitutes,
  getDepartments,
  getDepartmentById,
  getInstituteById,
  getUserAssociations,
  getAuthUser,
  updateProfile,
  updateAuthUser,
  updateAssociation,
};
