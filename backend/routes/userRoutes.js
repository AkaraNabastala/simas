import express from 'express';
import { 
    getUsers, 
    createUser, 
    updateProfile, 
    updateAccount, 
    deleteUser,
    importUsers // Tambahkan ini
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.post('/', authenticateToken, createUser);
router.post('/import', authenticateToken, importUsers); // Tambahkan rute ini
router.put('/profile/update', authenticateToken, updateProfile);
router.put('/account/update', authenticateToken, updateAccount);
router.delete('/:id', authenticateToken, deleteUser);

export default router;