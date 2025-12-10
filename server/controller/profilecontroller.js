const profileservice = require("../service/profileservice");

const profile = async (request, response) => {
  profileservice.getUserProfile(request, response);
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
  updateProfile,
  updateAuthUser,
  updateAssociation,
};
