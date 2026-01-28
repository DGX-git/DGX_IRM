const sequelize = require("../config/sequelize.config");

const approveFunctional = async (req, res) => {
  try {
    const { instance_request_id, updated_by } = req.body;

    // Get Approved-Functional status ID
    const [statusRow] = await sequelize.query(
      "SELECT status_id FROM status WHERE status_name = 'Approved-Functional'",
    );

    if (!statusRow.length) {
      return res.status(400).json({
        success: false,
        message: "Approved-Functional status not found",
      });
    }

    const status_id = statusRow[0].status_id;

    // Update instance request
    const [updated] = await sequelize.query(
      `
      UPDATE instance_request
      SET status_id = :status_id,
          updated_by = :updated_by,
          updated_timestamp = CURRENT_TIMESTAMP
      WHERE instance_request_id = :instance_request_id
      RETURNING *
      `,
      {
        replacements: {
          status_id,
          updated_by,
          instance_request_id,
        },
      },
    );

    if (!updated.length) {
      return res.status(404).json({
        success: false,
        message: "Instance request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request approved successfully (Functional)",
      data: updated[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve request",
      error: err.message,
    });
  }
};

const rejectRequest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { instance_request_id, remarks, new_status_id, logged_in_user_id } =
      req.body;

    // Validate input
    if (
      !instance_request_id ||
      !remarks ||
      !new_status_id ||
      !logged_in_user_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Update instance_request
    const [updateResult] = await sequelize.query(
      `
      UPDATE instance_request
      SET 
        status_id = :new_status_id,
        remarks = :remarks,
        updated_by = :updated_by,
        updated_timestamp = NOW()
      WHERE instance_request_id = :instance_request_id
      RETURNING *;
      `,
      {
        replacements: {
          new_status_id,
          remarks,
          updated_by: logged_in_user_id,
          instance_request_id,
        },
        transaction: t,
      },
    );

    if (updateResult.length === 0) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Instance request not found",
      });
    }

    // 2️⃣ Delete user time slots
    await sequelize.query(
      `
      DELETE FROM user_time_slot
      WHERE instance_request_id = :instance_request_id
      `,
      {
        replacements: { instance_request_id },
        transaction: t,
      },
    );

    await t.commit();

    res.json({
      success: true,
      message: "Request rejected successfully",
      data: updateResult[0],
    });
  } catch (err) {
    await t.rollback();
    console.error("Reject request error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to reject request",
      error: err.message,
    });
  }
};

module.exports = { approveFunctional, rejectRequest };
