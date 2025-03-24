import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  // Basic details
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  // Characteristics
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  // Images
  images: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for search
PropertySchema.index({ location: 'text', title: 'text' });
PropertySchema.index({ price: 1, bedrooms: 1, bathrooms: 1, size: 1 });

export default mongoose.model('Property', PropertySchema);