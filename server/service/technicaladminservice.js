const sequelize = require('../config/sequelize.config');

// Get all statuses
const getStatus = async (req, res) => {
  try {
    const [statuses] = await sequelize.query("SELECT * FROM status");
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get institutes for a specific user
const getUserInstitutes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get associations for this user
    const [associations] = await sequelize.query(
      `SELECT institute_id FROM user_institute_association WHERE user_id = ?`,
      { replacements: [userId] }
    );

    if (!associations || associations.length === 0) {
      return res.json([]);
    }

    // Get all institutes
    const [institutes] = await sequelize.query("SELECT * FROM institute");

    // Filter institutes based on associations
    const userInstituteList = institutes.filter((inst) =>
      associations.some((assoc) => assoc.institute_id === inst.institute_id)
    );

    res.status(200).json(userInstituteList);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get filtered instance requests
const getFilteredRequests = async (req, res) => {
  try {
    const {
      logged_in_user_id,
      from_date_param,
      to_date_param,
      status_id_param,
      institute_id_param
    } = req.body;

   const query = `
      SELECT * FROM fn_get_fad_tad_instance_requests_by_search_params(
        ?, ?, ?, ?, ?
      );
    `;

    const values = [
      logged_in_user_id || null,
      from_date_param || null,
      to_date_param || null,
      status_id_param || null,
      institute_id_param || null
    ];

    const [result] = await sequelize.query(query, { replacements: values });
    res.status(200).json(result);

  } catch (error) {
    console.error("Error calling function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const [users] = await sequelize.query("SELECT * FROM dgx_user");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all user-institute associations
const getAssociations = async (req, res) => {
  try {
    const [associations] = await sequelize.query(
      "SELECT * FROM user_institute_association"
    );
    res.status(200).json(associations);
  } catch (error) {
    console.error("Error fetching associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all institutes
const getInstitutes = async (req, res) => {
  try {
    const [institutes] = await sequelize.query("SELECT * FROM institute");
    res.status(200).json(institutes);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all time slots
const getTimeSlots = async (req, res) => {
  try {
    console.log('📥 Fetching all time slots...');
    
    const query = `
      SELECT 
        *
      FROM time_slot
      ORDER BY time_slot_id ASC;
    `;
    
    const result = await sequelize.query(query);
    
    console.log(`✅ Found ${result[0].length} time slots`);
    res.status(200).json(result[0]);
    
  } catch (error) {
    console.error('❌ Error fetching time slots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch time slots',
      message: error.message 
    });
  }
};

// Get all user time slots
const getUserTimeSlots = async (req, res) => {
  try {
    console.log('📥 Fetching all user time slots...');
    
    const query = `
      SELECT 
        user_time_slot_id,
        time_slot_id,
        selected_date,
        instance_request_id,
        created_by,
        created_timestamp,
        updated_by,
        updated_timestamp
      FROM user_time_slot
      ORDER BY instance_request_id ASC, selected_date ASC, time_slot_id ASC;
    `;
    
    const result = await sequelize.query(query);
    
    console.log(`✅ Found ${result[0].length} user time slots`);
    res.status(200).json(result[0]);
    
  } catch (error) {
    console.error('❌ Error fetching user time slots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user time slots',
      message: error.message 
    });
  }
};

// Update instance request (approve/reject/revoke/grant)
const updateInstanceRequest = async (req, res) => {
  try {
    const {
      instance_request_id,
      status_id,
      login_id,
      password,
      additional_information,
      is_access_granted,
      remarks,
      updated_by
    } = req.body;

    // Build dynamic update query
    let updateFields = [];
    let values = [];
    let paramIndex = 1;

    if (status_id !== undefined) {
      updateFields.push(`status_id = $${paramIndex++}`);
      values.push(status_id);
    }
    if (login_id !== undefined) {
      updateFields.push(`login_id = $${paramIndex++}`);
      values.push(login_id);
    }
    if (password !== undefined) {
      updateFields.push(`password = $${paramIndex++}`);
      values.push(password);
    }
    if (additional_information !== undefined) {
      updateFields.push(`additional_information = $${paramIndex++}`);
      values.push(additional_information);
    }
    if (is_access_granted !== undefined) {
      updateFields.push(`is_access_granted = $${paramIndex++}`);
      values.push(is_access_granted);
    }
    if (remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(remarks);
    }
    if (updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(updated_by);
    }
    
    updateFields.push(`updated_timestamp = $${paramIndex++}`);
    values.push(new Date().toISOString());

    values.push(instance_request_id);

    const query = `
      UPDATE instance_request 
      SET ${updateFields.join(', ')}
      WHERE instance_request_id = $${paramIndex}
      RETURNING *
    `;

    const [result] = await sequelize.query(query, { replacements: values });
    
    if (result && result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  } catch (error) {
    console.error("Error updating instance request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user time slots
const deleteUserTimeSlots = async (req, res) => {
  try {
    const { instance_request_id } = req.params;

    const query = `
      DELETE FROM user_time_slot 
      WHERE instance_request_id = ?
    `;

    await sequelize.query(query, { replacements: [instance_request_id] });
    res.status(200).json({ message: "Time slots deleted successfully" });
  } catch (error) {
    console.error("Error deleting user time slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMasters = async (req, res) => {
  try {
    const [
      [departments],
      [userTypes],
      [cpuList],
      [ramList],
      [gpuPartitions],
      [gpuVendors],
      [imageList],
    ] = await Promise.all([
      sequelize.query("SELECT * FROM department"),
      sequelize.query("SELECT * FROM user_type"),
      sequelize.query("SELECT * FROM cpu"),
      sequelize.query("SELECT * FROM ram"),
      sequelize.query("SELECT * FROM gpu_partition"),
      sequelize.query("SELECT * FROM gpu"),
      sequelize.query("SELECT * FROM image"),
    ]);

    res.status(200).json({
      departments,
      userTypes,
      cpuList,
      ramList,
      gpuPartitions,
      gpuVendors,
      imageList,
    });
  } catch (error) {
    console.error("Error fetching master tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      instance_request_id,
      status_id,
      login_id,
      password,
      additional_information,
      is_access_granted,
      updated_by,
    } = req.body;

    console.log('📥 Approving request:', {
      instance_request_id,
      status_id,
      login_id,
      is_access_granted,
      updated_by,
    });

    // Validate required fields
    if (!instance_request_id || !status_id || !login_id || !password || !updated_by) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if the request exists
    const [checkResult] = await sequelize.query(
      `SELECT instance_request_id, status_id, user_id
       FROM instance_request
       WHERE instance_request_id = :instance_request_id`,
      {
        replacements: { instance_request_id },
        transaction,
      }
    );

    if (checkResult.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Instance request not found',
      });
    }

    // Update the instance request
    const [updateResult] = await sequelize.query(
      `UPDATE instance_request
       SET 
         status_id = :status_id,
         login_id = :login_id,
         password = :password,
         additional_information = :additional_information,
         is_access_granted = :is_access_granted,
         updated_by = :updated_by,
         updated_timestamp = CURRENT_TIMESTAMP
       WHERE instance_request_id = :instance_request_id
       RETURNING *`,
      {
        replacements: {
          status_id,
          login_id,
          password,
          additional_information: additional_information || null,
          is_access_granted: is_access_granted !== undefined ? is_access_granted : true,
          updated_by,
          instance_request_id,
        },
        transaction,
      }
    );

    await transaction.commit();

    console.log('✅ Request approved successfully:', updateResult[0]);

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: updateResult[0],
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error approving request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
      error: error.message,
    });
  }
};

// ========================================
// POST /technicaladmin/reject-request
// Reject a request and delete associated time slots
// ========================================

const rejectRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      instance_request_id,
      status_id,
      remarks,
      updated_by,
    } = req.body;

    console.log('📥 Rejecting request:', {
      instance_request_id,
      status_id,
      remarks,
      updated_by,
    });

    // Validate required fields
    if (!instance_request_id || !status_id || !remarks || !updated_by) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if the request exists
    const [checkResult] = await sequelize.query(
      `SELECT instance_request_id, user_id
       FROM instance_request
       WHERE instance_request_id = :instance_request_id`,
      {
        replacements: { instance_request_id },
        transaction,
      }
    );

    if (checkResult.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Instance request not found',
      });
    }

    // Update the instance request with rejection status
    const [updateResult] = await sequelize.query(
      `UPDATE instance_request
       SET 
         status_id = :status_id,
         remarks = :remarks,
         is_access_granted = false,
         updated_by = :updated_by,
         updated_timestamp = CURRENT_TIMESTAMP
       WHERE instance_request_id = :instance_request_id
       RETURNING *`,
      {
        replacements: {
          status_id,
          remarks,
          updated_by,
          instance_request_id,
        },
        transaction,
      }
    );

    // Delete all user time slots for this request
    const [deleteResult] = await sequelize.query(
      `DELETE FROM user_time_slot
       WHERE instance_request_id = :instance_request_id
       RETURNING *`,
      {
        replacements: { instance_request_id },
        transaction,
      }
    );

    console.log(`🗑️ Deleted ${deleteResult.length} time slots`);

    await transaction.commit();

    console.log('✅ Request rejected successfully:', updateResult[0]);

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: updateResult[0],
      deletedTimeSlots: deleteResult.length,
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error rejecting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: error.message,
    });
  }
};

// ========================================
// POST /technicaladmin/grant-access
// Grant access to an approved request
// ========================================

const grantAccess = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      instance_request_id,
      updated_by,
    } = req.body;

    console.log('📥 Granting access for request:', {
      instance_request_id,
      updated_by,
    });

    // Validate required fields
    if (!instance_request_id || !updated_by) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if the request exists
    const [checkResult] = await sequelize.query(
      `SELECT instance_request_id, status_id
       FROM instance_request
       WHERE instance_request_id = :instance_request_id`,
      {
        replacements: { instance_request_id },
        transaction,
      }
    );

    if (checkResult.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Instance request not found',
      });
    }

    // Grant access
    const [updateResult] = await sequelize.query(
      `UPDATE instance_request
       SET 
         is_access_granted = true,
         updated_by = :updated_by,
         updated_timestamp = CURRENT_TIMESTAMP
       WHERE instance_request_id = :instance_request_id
       RETURNING *`,
      {
        replacements: {
          updated_by,
          instance_request_id,
        },
        transaction,
      }
    );

    await transaction.commit();

    console.log('✅ Access granted successfully:', updateResult[0]);

    res.status(200).json({
      success: true,
      message: 'Access granted successfully',
      data: updateResult[0],
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error granting access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grant access',
      error: error.message,
    });
  }
};

// ========================================
// POST /technicaladmin/revoke-access
// Revoke access from an approved request
// ========================================

const revokeAccess = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      instance_request_id,
      remarks,
      updated_by,
    } = req.body;

    console.log('📥 Revoking access for request:', {
      instance_request_id,
      remarks,
      updated_by,
    });

    // Validate required fields
    if (!instance_request_id || !remarks || !updated_by) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if the request exists
    const [checkResult] = await sequelize.query(
      `SELECT instance_request_id, is_access_granted
       FROM instance_request
       WHERE instance_request_id = :instance_request_id`,
      {
        replacements: { instance_request_id },
        transaction,
      }
    );

    if (checkResult.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Instance request not found',
      });
    }

    // Revoke access
    const [updateResult] = await sequelize.query(
      `UPDATE instance_request
       SET 
         is_access_granted = false,
         remarks = :remarks,
         updated_by = :updated_by,
         updated_timestamp = CURRENT_TIMESTAMP
       WHERE instance_request_id = :instance_request_id
       RETURNING *`,
      {
        replacements: {
          remarks,
          updated_by,
          instance_request_id,
        },
        transaction,
      }
    );

    await transaction.commit();

    console.log('✅ Access revoked successfully:', updateResult[0]);

    res.status(200).json({
      success: true,
      message: 'Access revoked successfully',
      data: updateResult[0],
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error revoking access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke access',
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
  getUserInstitutes,
  getFilteredRequests,
  getUsers,
  getAssociations,
  getInstitutes,
  getTimeSlots,
  getUserTimeSlots,
  updateInstanceRequest,
  deleteUserTimeSlots,
  getMasters,
  approveRequest,
  rejectRequest,
  grantAccess,
  revokeAccess,
};