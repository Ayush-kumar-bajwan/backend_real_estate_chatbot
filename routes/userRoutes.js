import express from 'express';
import { 
  saveProperty, 
  getSavedProperties, 
  removeSavedProperty 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/properties')
  .get(protect, getSavedProperties)
  .post(protect, saveProperty);

router.route('/properties/:id')
  .delete(protect, removeSavedProperty);

export default router;