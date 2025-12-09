const registerservice = require("../service/registerservice");

const createUser = async (request, response) => {
  registerservice.createUser(request, response);
};

const getInstitutes = async (request, response) => {
  registerservice.getInstitutes(request, response);
};

const getDepartments = async (request, response) => {
  registerservice.getDepartments(request, response);
};

const getRoles = async (request, response) => {
  registerservice.getRoles(request, response);
};

module.exports = { getInstitutes, getDepartments, getRoles, createUser };
