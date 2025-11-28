const profileservice = require('../service/profileservice')

const profile = async(request, response) => {
    profileservice.profile(request, response);
}



module.exports =  {profile};