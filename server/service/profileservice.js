const sequelize = require('../config/sequelize.config');


const profile = async(request, response) => {
    try {
        // Query logic
    } catch (error) {
        console.error('Error during user registration:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { profile }