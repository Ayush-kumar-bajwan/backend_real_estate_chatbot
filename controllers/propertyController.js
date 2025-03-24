import asyncHandler from 'express-async-handler';
import Property from '../models/Property.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Property.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const properties = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination,
    data: properties
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ id: req.params.id });

  if (!property) {
    return res.status(404).json({
      success: false,
      message: `Property not found with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Search properties based on chatbot filters
// @route   POST /api/properties/search
// @access  Public
const searchProperties = asyncHandler(async (req, res) => {
  const { 
    minPrice, maxPrice, location, bedrooms, 
    bathrooms, size, amenities
  } = req.body;

  // Build query
  const query = {};

  // Add filters to query
  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
    query.price = { $gte: minPrice };
  } else if (maxPrice) {
    query.price = { $lte: maxPrice };
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (bedrooms) {
    query.bedrooms = { $gte: bedrooms };
  }

  if (bathrooms) {
    query.bathrooms = { $gte: bathrooms };
  }

  if (size) {
    query.size = { $gte: size };
  }

  if (amenities && amenities.length > 0) {
    query.amenities = { $all: amenities };
  }

  const properties = await Property.find(query).limit(10);

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

export { getProperties, getProperty, searchProperties };