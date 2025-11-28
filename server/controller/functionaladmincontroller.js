const functionaladminservice = require('../service/functionaladminservice')

const functionaladmin = async(request, response) => {
	functionaladminservice.functionaladmin(request, response);
}



module.exports =  {functionaladmin};