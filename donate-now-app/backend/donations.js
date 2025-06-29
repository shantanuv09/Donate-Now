const express = require("express");
const { Web3 } = require("web3");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: "Too many login attempts, please try again later" },
});

const app = express();
app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.use("/api/v1", authLimiter);

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_URL));
const contractABI = require("./SecureDonationABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);
const ownerAddress = process.env.OWNER_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, sparse: true, lowercase: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  hashedPassword: { type: String, required: true },
  name: { type: String, required: true },
  isWalletVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["donor", "organizer", "admin"],
    default: "donor",
  },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

const nonceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  nonce: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Automatically expire after 10 minutes
  },
});

// Compound index to ensure uniqueness
nonceSchema.index({ userId: 1, walletAddress: 1 }, { unique: true });
const Nonce = mongoose.model("Nonce", nonceSchema);

const donationSchema = new mongoose.Schema({
  donor: { type: String, required: true },
  campaignId: { type: Number, required: true, ref: "Campaign" },
  amount: { type: Number, required: true },
  transactionHash: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
});
const Donation = mongoose.model("Donation", donationSchema);

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  recipient: { type: String, required: true },
  goal: { type: Number, required: true },
  fundsRaised: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

function generateCampaignId() {
  return uuidv4(); // Example: "550e8400-e29b-41d4-a716-446655440000"
}

// Sign-up
app.post("/api/v1/sign-up", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, walletAddress } = req.body;

    if (!name || !password || !confirmPassword || !email || !walletAddress)
      return res.status(400).json({ message: "All fields must be entered!" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      hashedPassword,
      walletAddress,
    });

    const user = await User.findOne({ email });

    await Nonce.create({
      userId: user._id,
      walletAddress: walletAddress,
      nonce: null,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/v1/auth/verify-credentials", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    return res.status(200).json({
      success: true,
      userId: user._id,
      message: "Credentials verified successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/v1/auth/metamask-nonce", async (req, res) => {
  try {
    const { address, userId } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Verify that the userId is valid
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random nonce
    const nonce = crypto.randomBytes(16).toString("hex");

    // Store or update the nonce
    await Nonce.findOneAndUpdate(
      { userId, walletAddress: address.toLowerCase() },
      { nonce },
      { upsert: true, new: true }
    );

    return res.status(200).json({ nonce });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/v1/auth/complete-login", async (req, res) => {
  try {
    const { userId, address, signature, nonce } = req.body;

    if (!userId || !address || !signature || !nonce) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const existingUserWithWallet = await User.findOne({ 
      walletAddress: address.toLowerCase(),
      _id: { $ne: userId } // Exclude current user
    });
    
    if (existingUserWithWallet) {
      return res.status(409).json({ 
        error: 'This wallet address is already linked to another account' 
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedNonce = await Nonce.findOne({
      userId,
      walletAddress: address.toLowerCase(),
    });

    if (!storedNonce || storedNonce.nonce !== nonce) {
      return res.status(401).json({ error: "Invalid nonce" });
    }

    const message = `Sign this message to complete authentication with DonateNow: ${nonce}`;

    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      if (!user.walletAddress) {
        user.walletAddress = address.toLowerCase();
      }

      user.isWalletVerified = true;
      await user.save();

      await Nonce.findOneAndUpdate(
        { walletAddress: user.walletAddress },
        { nonce: null }
      );

      // Generate JWT token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        accessToken,
        refreshToken,
        user: {
          userId: user._id,
          role: user.role,
          walletAddress: user.walletAddress,
        },
      });
    } catch (error) {
      console.error("Signature verification error:", error);
      return res.status(401).json({ error: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .json({
        message: "Unauthorized",
      })
      .status(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authenticateRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

app.post("/api/v1/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required!" });

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post(
  "/api/v1/create-organizer",
  authenticateToken,
  authenticateRole("admin"),
  async (req, res) => {
    try {
      const { name, email, password, walletAddress } = req.body;

      if (!name || !email || !password || !walletAddress) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { walletAddress }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or Wallet Address already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        hashedPassword,
        walletAddress,
        role: "organizer",
      });

      res.status(201).json({
        message: "Organizer account created successfully.",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Create Campaign
app.post(
  "/api/v1/create-campaign",
  authenticateToken,
  authenticateRole("organizer"),
  async (req, res) => {
    try {
      const { name, recipient, goal } = req.body;
      const tx = contract.methods.createCampaign(name, recipient, goal);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: tx.encodeABI(),
          gas: 3000000,
        },
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      await Campaign.create({
        campaignId: generateCampaignId(),
        name: name,
        recipient: recipient,
        goal: goal,
      });
      res.json({ success: true, transactionHash: receipt.transactionHash });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Donate to Campaign
app.post(
  "/api/v1/donate",
  authenticateToken,
  authenticateRole("donor"),
  async (req, res) => {
    try {
      const { donor, campaignId, amount } = req.body;

      const tx = contract.methods.donate(campaignId);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: tx.encodeABI(),
          value: web3.utils.toWei(amount.toString(), "ether"),
          gas: 3000000,
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      await Donation.create({
        donor,
        campaignId,
        amount: parseFloat(amount),
        transactionHash: receipt.transactionHash,
      });

      await Campaign.findOneAndUpdate(
        { campaignId },
        { $inc: { fundsRaised: parseFloat(amount) } },
        { new: true }
      );

      res.json({ success: true, transactionHash: receipt.transactionHash });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Release Funds
app.post(
  "/api/v1/releaseFunds",
  authenticateToken,
  authenticateRole("admin"),
  async (req, res) => {
    try {
      const { campaignId } = req.body;
      const tx = contract.methods.releaseFunds(campaignId);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: tx.encodeABI(),
          gas: 3000000,
        },
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      await Campaign.findOneAndUpdate(
        {
          campaignId,
        },
        {
          isCompleted: true,
        }
      );

      res.json({ success: true, transactionHash: receipt.transactionHash });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

app.post("/api/v1/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required!" });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function createAdminAccount() {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const adminPassword = "admin";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new User({
      name: "admin",
      email: "admin@donatenow.com",
      hashedPassword: hashedPassword,
      walletAddress: ownerAddress,
      role: "admin",
    });

    await admin.save();
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Error creating admin account:", error.message);
  }
}

createAdminAccount();

app.listen(3000, () => console.log("Server running on port 3000"));
