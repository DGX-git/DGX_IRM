// backend/controllers/emailController.js
const emailService = require('../service/emailsservice');

const sendApprovalEmail = async (request, response) => {
    emailService.sendApprovalEmail(request, response);
};

const sendRejectionEmail = async (request, response) => {
    emailService.sendRejectionEmail(request, response);
};

const sendRevokeEmail = async (request, response) => {
    emailService.sendRevokeEmail(request, response);
};

const sendGrantAccessEmail = async (request, response) => {
    emailService.sendGrantAccessEmail(request, response);
};

module.exports = {
    sendApprovalEmail,
    sendRejectionEmail,
    sendRevokeEmail,
    sendGrantAccessEmail
};