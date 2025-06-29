const express = require("express");
const { login, refreshToken, logout } = require("../controllers/authController");
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Login route
router.post("/login", login);

router.post("/refresh-token", authenticate, refreshToken);

router.post("/logout", logout)

module.exports = router;