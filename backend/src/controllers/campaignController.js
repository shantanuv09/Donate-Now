const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// Create a campaign
const createCampaign = async (req, res) => {
  const { title, category, goal, createdAt, endDate, description } = req.body;
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const organizerId = jwt.verify(token, process.env.JWT_SECRET).userId;
    if (!token || !organizerId) {
      return res
        .status(401)
        .json({ message: "Invalid or missing Authorization header" });
    }
    if (
      !title ||
      !category ||
      !goal ||
      !createdAt ||
      !endDate ||
      !description
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const campaign = await prisma.campaign.create({
      data: {
        // Ensure it's a string
        title,
        category,
        organizerId,
        goal: parseFloat(goal), // Ensure goal is a number
        createdAt,
        endDate,
        description,
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error("❌ Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

const getCampaignByOrgId = async (req, res) => {
  try {
    const { organizerId } = req.body;
    const orgData = await prisma.campaign.findMany({
      where: { organizerId },
    });
    if (!orgData) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json(orgData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

// Get a campaign by ID
const getCampaignById = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

const approveCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const approveCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        isApproved: true,
      }
    })
    res.status(200).json(approveCampaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve campaign" });
  }
}

// Update a campaign
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { amount, isCompleted } = req.body;
  try {
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        fundsRaised: { increment: amount },
        isCompleted
      },
    });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: `Failed to update campaign ${error}` });
  }
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignByOrgId,
  approveCampaign
};
