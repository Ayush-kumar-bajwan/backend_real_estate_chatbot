import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from '../models/Property.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadAndMergeData = async () => {
  try {
    console.log('Loading property data...');
    
    // Load JSON files
    const basicsPath = path.join(__dirname, '../data/property_basics.json');
    const characteristicsPath = path.join(__dirname, '../data/property_characteristics.json');
    const imagesPath = path.join(__dirname, '../data/property_images.json');
    
    const basicsData = JSON.parse(await fs.readFile(basicsPath, 'utf8'));
    const characteristicsData = JSON.parse(await fs.readFile(characteristicsPath, 'utf8'));
    const imagesData = JSON.parse(await fs.readFile(imagesPath, 'utf8'));
    
    // Create a map for faster lookups
    const characteristicsMap = new Map();
    characteristicsData.forEach(item => {
      characteristicsMap.set(item.id, item);
    });
    
    const imagesMap = new Map();
    imagesData.forEach(item => {
      imagesMap.set(item.id, item);
    });
    
    // Merge data
    const mergedData = basicsData.map(basic => {
      const characteristics = characteristicsMap.get(basic.id) || {};
      const images = imagesMap.get(basic.id) || { images: [] };
      
      return {
        id: basic.id,
        title: basic.title || '',
        price: basic.price || 0,
        location: basic.location || '',
        bedrooms: characteristics.bedrooms || 0,
        bathrooms: characteristics.bathrooms || 0,
        size: characteristics.size_sqft || 0,
        amenities: characteristics.amenities || [],
        images: images.image_url || []
      };
    });
    
    // Check if database is already populated
    const count = await Property.countDocuments();
    
    if (count === 0) {
      console.log('Populating database with property data...');
      await Property.insertMany(mergedData);
      console.log(`${mergedData.length} properties loaded to database`);
    } else {
      console.log(`Database already contains ${count} properties. Skipping data load.`);
    }
  } catch (error) {
    console.error('Error loading property data:', error);
  }
};

export { loadAndMergeData };