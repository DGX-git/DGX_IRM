const sequelize = require('../config/sequelize.config');


const user = async(request, response) => {
    try {
        // Query logic
    } catch (error) {
        console.error('Error during user registration:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

const getUser = async (req, res) => {
 try {
    const { user_id, from_date, to_date, status_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const result = await sequelize.query(
      `SELECT * FROM fn_get_user_instance_requests_by_search_params(
        $1, $2, $3, $4
      )`,
      {
        bind: [
          Number(user_id),
          from_date || null,
          to_date || null,
          status_id ? Number(status_id) : null
        ],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.json(result);
  } catch (error) {
    console.error("Error fetching instance requests:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async(req, res) => {
  try {
    const instanceRequestId = req.params.id;

    if (!instanceRequestId) {
      return res.status(400).json({ error: "Instance Request ID is required" });
    }

    // Step 1: Delete user_time_slot entries
    await sequelize.query(
      `DELETE FROM user_time_slot WHERE instance_request_id = $1`,
      {
        bind: [instanceRequestId],
      }
    );

    // Step 2: Delete instance_request entry
    await sequelize.query(
      `DELETE FROM instance_request WHERE instance_request_id = $1`,
      {
        bind: [instanceRequestId],
      }
    );

    return res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({ error: "Failed to delete request" });
  }
}

module.exports = { user, getUser, deleteUser };