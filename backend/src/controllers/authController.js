const prisma = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT Secret (from .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    // If password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role === 'organizer' && user.organizerStatus != true) {
      return res.status(500).json({error: "Organizer request not accepted. Please try again after sometime."})
    }

    // Generate an access token (short-lived)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" } // 15 minutes
    );

    // Generate a refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // 7 days
    );

    // Save the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return the tokens
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
  
      // Find the user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

  
      // If user doesn't exist or refresh token doesn't match
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }
      
      // Generate a new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" } // 15 minutes
      );
      // Return the new access token
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid refresh token" });
    }
  };

  const logout = async (req, res) => {
    const { id } = req.body;
    try {
      const user = await prisma.user.update(
        {
        where: {id: id},
        data: {
          refreshToken: null
        }
      }
      )
      res.status(200).json({success: "Successfully Logged Out"})
    } catch (error) {
      res.status(401).json({ error: "Cannot Logout" });
    }
  }
  
  module.exports = { login, refreshToken, logout };