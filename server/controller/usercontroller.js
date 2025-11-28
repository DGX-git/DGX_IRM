const userservice = require('../service/userservice')

const user = async(request, response) => {
    userservice.user(request, response);
}



module.exports =  {user};