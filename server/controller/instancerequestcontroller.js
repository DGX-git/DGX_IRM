const instancerequestservice = require('../service/instancerequestservice')

const instancerequest = async(request, response) => {
    instancerequestservice.instancerequest(request, response);
}



module.exports =  {instancerequest};