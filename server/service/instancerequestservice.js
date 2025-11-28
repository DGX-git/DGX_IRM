const sequelize = require('../config/sequelize.config');
const { CPU } = require('../model/cpu.model');
var cors = require('cors');


const instancerequest = async(request, response) => {
    try {
        // Query logic
    } catch (error) {
        console.error('Error during user registration:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}


const getCpu = async() => {
    sequelize.sync()
        .then(async () => {
            let cpu = await CPU.findAll();
            response.status(200).json(cpu);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}


module.exports = { instancerequest, getCpu }