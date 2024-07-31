// controllers/staffController.js
const Staff = require('../Model/staffModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new staff member
exports.createStaff = async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  try {
    const newStaff = new Staff({ name, phoneNumber, password });
    await newStaff.save();
    res.status(201).json({ message: 'Staff created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit a staff member
exports.editStaff = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sign in a staff member
exports.signInStaff = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const staff = await Staff.findOne({ phoneNumber });
    if (!staff) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: staff._id }, 'myjwtsecretkey');
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all staff members with pagination
exports.getStaff = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const totalStaff = await Staff.countDocuments();
      const staff = await Staff.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({ staffs: staff, total: totalStaff });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  
  // Get a staff member by ID
  exports.getStaffById = async (req, res) => {
    const { id } = req.params;
    try {
      const staff = await Staff.findById(id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
      res.status(200).json(staff);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };