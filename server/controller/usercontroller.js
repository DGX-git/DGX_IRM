const userservice = require('../service/userservice')


const getUser = async(request, response) => {
    userservice.getUser(request, response);
}

const deleteUser = async(request, response) => {
    userservice.deleteUser(request, response);
}




module.exports =  {getUser, deleteUser} ;