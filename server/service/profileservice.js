const dgx_user = require("../model/dgx_user.model");
const UserInstituteAssociation = require("../model/user_institute_association.model");
const sequelize = require("../config/sequelize.config");

// const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Raw query calling the PostgreSQL function
    const result = await sequelize.query(
      "SELECT fn_get_user_profile(:email) AS data",
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const data = result[0].data;

    if (data.error) {
      return res.status(404).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAuthUser = async (req, res) => {
  try {
    // req.user should be set by your authenticateToken middleware
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting auth user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      first_name,
      last_name,
      contact_no,
      email_id,
      updated_by,
      updated_timestamp,
    } = req.body;

    // Check if user exists
    const user = await dgx_user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user
    await user.update({
      first_name,
      last_name,
      contact_no,
      email_id,
      updated_by,
      updated_timestamp: updated_timestamp || new Date(),
    });

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAuthUser = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    // Get current user from token
    // const userId = req.user.user_id;

    // Create updated token with new metadata
    const updatedToken = jwt.sign(
      {
        ...req.user,
        first_name,
        last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Auth user updated successfully",
      token: updatedToken,
    });
  } catch (error) {
    console.error("Error updating auth user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAssociation = async (req, res) => {
  try {
    const { associationId } = req.params;
    const {
      is_reg_institute,
      institute_id,
      department_id,
      updated_by,
      updated_timestamp,
    } = req.body;

    // Find association
    const association = await UserInstituteAssociation.findByPk(associationId);
    if (!association) {
      return res.status(404).json({ error: "Association not found" });
    }

    // Build update object
    const updateData = {
      updated_by,
      updated_timestamp: updated_timestamp || new Date(),
    };

    if (is_reg_institute !== undefined) {
      updateData.is_reg_institute = is_reg_institute;
    }
    if (institute_id !== undefined) {
      updateData.institute_id = institute_id;
    }
    if (department_id !== undefined) {
      updateData.department_id = department_id;
    }

    // Update association
    await association.update(updateData);

    res.status(200).json({
      message: "Association updated successfully",
      association,
    });
  } catch (error) {
    console.error("Error updating association:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getUserProfile,
  getAuthUser,
  updateProfile,
  updateAuthUser,
  updateAssociation,
};
