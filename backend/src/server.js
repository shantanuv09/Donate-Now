const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

dotenv.config();

const app = express();
const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require("../src/SecureDonationABI.json"); // Ensure you have ABI file
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
// Routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@donatenow.com" }
    });

    if (!existingAdmin) {
      const adminPassword = "admin";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await prisma.user.create({
        data: {
          name: "admin",
          email: "admin@donatenow.com",
          hashedPassword: hashedPassword,
          walletAddress: process.env.OWNER_ADDRESS,
          role: "admin"
        }
      });
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma & MongoDB");
    
    // Create admin user if not exists
    await createAdminUser();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Prisma connection error:", error);
  }  
};

startServer();