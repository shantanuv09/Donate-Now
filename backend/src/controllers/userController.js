const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { authenticateToken, authenticateRole } = require('../utils/authMiddleware');

// Helper function to exclude fields
function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
}

// Register a new user
const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword, name, walletAddress, orgName, orgDescription, is_wallet_verified } = req.body;
    
    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match"});
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role based on provided organization info
    const role = orgName && orgDescription ? 'organizer' : 'donor';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
        walletAddress,
        isWalletVerified: is_wallet_verified,
        role,
        orgName: orgName || null,
        orgDescription: orgDescription || null,
        organizerStatus: (role === 'organizer' ? false : null)
      }
    });

    // Exclude sensitive fields
    const userWithoutPassword = exclude(user, ['hashedPassword', 'refreshToken']);

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: `Registration failed, ${error}` });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: req.params.id},
      select: {
        name: true,
        organizerStatus: true,
        createdAt: true,
        walletAddress: true
      }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Cannot get user' });
  }
}

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    // This route is protected by authenticateToken middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Changed from req.user.userId to req.user.id
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        role: true,
        isWalletVerified: true,
        orgName: true,
        orgDescription: true,
        organizerStatus: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const acceptOrg = async (req, res) => {
  try {
    const { id } = req.params
    const acceptOrg = await prisma.user.update({
      where: { id },
      data: {
        organizerStatus: true
      }
    })
    res.status(200).json(acceptOrg);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// Update user profile (authenticated users can update their own profile)
const updateUser = async (req, res) => {
  try {
    const { name, walletAddress, orgName, orgDescription } = req.body;
    const userId = req.params.id || req.user.id; // Allow admins to update others

    // Regular users can only update their own profile
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        walletAddress,
        orgName: req.user.role === 'organizer' || req.user.role === 'admin' ? orgName : undefined,
        orgDescription: req.user.role === 'organizer' || req.user.role === 'admin' ? orgDescription : undefined
      },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        role: true,
        isWalletVerified: true,
        orgName: true,
        orgDescription: true,
        organizerStatus: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Admin-only: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isWalletVerified: true,
        organizerStatus: true,
        createdAt: true,
        walletAddress: true,
        orgDescription: true,
        orgName: true
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Admin-only: Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!['donor', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent changing your own role
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        role,
        organizerStatus: role === 'organizer' 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizerStatus: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// Admin-only: Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete user with associated records' 
      });
    }
    
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  authenticateToken, // Export the middleware for use in routes
  authenticateRole,
  acceptOrg,
  getUser
};