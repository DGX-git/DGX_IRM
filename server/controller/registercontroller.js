const register = require('../service/registerservice')

const register = async(request, response) => {
    registerservice.register(request, response);
}



module.exports =  {register};