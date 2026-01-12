const loginservice = require("../service/loginservice");

const checkEmail = async (request, response) => {
  loginservice.checkEmail(request, response);
};
const signin = async (request, response) => {
  loginservice.signin(request, response);
};

const verifyOtp = async (request, response) => {
  loginservice.verifyOtp(request, response);
};
const signOut = async (request, response) => {
  loginservice.signOut(request, response);
};

module.exports = { checkEmail, signin, verifyOtp, signOut };
