import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Save property to user's saved list
// @route   POST /api/users/properties
// @access  Private
const saveProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  
  if (!propertyId) {
    return res.status(400).json({
      success: false,
      message: "Property ID is required"
    });
  }

  console.log(`Looking for property with id: ${propertyId}`);
  
  // Check if property exists
  const property = await Property.findOne({ id: propertyId });
  console.log("Found property:", property);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: `Property not found with id of ${propertyId}`
    });
  }

  // Check if property is already saved
  const user = await User.findById(req.user.id);
  
  const alreadySaved = user.savedProperties.includes(property._id);

  if (alreadySaved) {
    return res.status(400).json({
      success: false,
      message: 'Property already saved'
    });
  }

  // Save property
  user.savedProperties.push(property._id);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Property saved successfully'
  });
});

// @desc    Get user's saved properties
// @route   GET /api/users/properties
// @access  Private
const getSavedProperties = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedProperties');

  res.status(200).json({
    success: true,
    count: user.savedProperties.length,
    data: user.savedProperties
  });
});

// @desc    Remove property from user's saved list
// @route   DELETE /api/users/properties/:id
// @access  Private
const removeSavedProperty = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Get property
  const property = await Property.findOne({ id: req.params.id });
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: `Property not found with id of ${req.params.id}`
    });
  }
  
  // Check if property is saved
  const savedPropertyIndex = user.savedProperties.indexOf(property._id);
  
  if (savedPropertyIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'Property not in saved list'
    });
  }
  
  // Remove property
  user.savedProperties.splice(savedPropertyIndex, 1);
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Property removed from saved list'
  });
});

export { saveProperty, getSavedProperties, removeSavedProperty };