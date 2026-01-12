const functionaladminservice = require('../service/functionaladminservice')


const approveFunctional = async(request, response) => {
	functionaladminservice.approveFunctional(request, response);
}

const rejectRequest = async(request, response) => {
	functionaladminservice.rejectRequest(request, response);
}



module.exports =  {approveFunctional, rejectRequest};