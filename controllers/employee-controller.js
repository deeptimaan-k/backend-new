const Employee = require('../models/employeeSchema');

// Create a new employee
const createEmployee = async (req, res) => {
  const { name, email, phoneNo, address, position, department, school, hireDate, salary, employmentStatus, emergencyContact, profilePicture } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      phoneNo,
      address,
      position,
      department,
      school,
      hireDate,
      salary,
      employmentStatus,
      emergencyContact,
      profilePicture,
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      data: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('school', 'schoolName') // Populate related school model
      .exec();

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};

// Get an employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id)
      .populate('school', 'schoolName') // Populate related school model
      .exec();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true })
      .populate('school', 'schoolName') // Populate related school model
      .exec();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
