const sequelize = require("../config/sequelize.config");
const Role = require("../model/role.model");
const Department = require("../model/department.model");
const Institute = require("../model/institute.model");
const DGX_USER = require("../model/dgx_user.model");
const USER_ASSOCIATION = require("../model/user_institute_association.model");

const getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.findAll();
    res.status(200).json(institutes);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDepartments = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const departments = await Department.findAll({
      where: { institute_id: instituteId },
    });
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function for insert data into dgx_user table

const createUser = async (req, res) => {
  try {
    const existingUser = await DGX_USER.findOne({
      where: { email_id: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await DGX_USER.create({
      first_name: req.body.firstName,
      last_name: req.body.lastName,

      role_id: req.body.role,
      contact_no: req.body.phoneNumber,
      email_id: req.body.email,
    });

    const userAssociation = await USER_ASSOCIATION.create({
      user_id: user.user_id,
      institute_id: req.body.institute,
      department_id: req.body.department,
      created_by: user.user_id,
      is_reg_institute: true,
    });

    return res.status(201).json({
      success: true,
      data: { user, userAssociation },
    });
  } catch (err) {
    console.error("Create User Error:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getInstitutes, getDepartments, getRoles, createUser };
