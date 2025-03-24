import express from 'express';
import { 
  getProperties, 
  getProperty, 
  searchProperties 
} from '../controllers/propertyController.js';

const router = express.Router();

router.route('/').get(getProperties);
router.route('/search').post(searchProperties);
router.route('/:id').get(getProperty);

export default router;