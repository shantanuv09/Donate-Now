const express = require('express');
const router = express.Router();
const {
  createUser,
  getCurrentUser,
  updateUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  authenticateToken,
  authenticateRole,
  acceptOrg,
  getUser
} = require('../controllers/userController');

// Public routes
router.post('/users', createUser);

// Authenticated routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateUser);
router.put('/me/update', authenticateToken, updateUser);
router.get('/users/:id', authenticateToken, getUser);
// Admin-only routes
router.get('/users', authenticateToken, authenticateRole(['admin']), getAllUsers);
router.put('/users/:id/role', authenticateToken, authenticateRole(['admin']), updateUserRole);
router.delete('/users/:id', authenticateToken, authenticateRole(['admin']), deleteUser);

// Allow admins to update other users
router.put('/users/:id', authenticateToken, authenticateRole(['admin']), updateUser);
router.post('/users/accept/:id', authenticateToken, authenticateRole(['admin']), acceptOrg);
module.exports = router;