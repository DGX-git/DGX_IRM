const loginservice = require('../service/loginservice')

const login = async(request, response) => {
    loginservice.login(request, response);
}



module.exports =  {login};