const technicaladminservice = require('../service/technicaladminservice')

const technicaladmin = async(request, response) => {
    technicaladminservice.technicaladmin(request, response);
}



module.exports =  {technicaladmin};