const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a donation
const createDonation = async (req, res) => {
  const { donorId, campaignId, amount, transactionHash } = req.body;
  try {
    const donation = await prisma.donation.create({
      data: {
        donorId,
        campaignId,
        amount,
        transactionHash,
      },
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: `Failed to create donation ${error}` });
  }
};

// Get all donations
const getDonations = async (req, res) => {
  try {
    const donations = await prisma.donation.findMany();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// Get a donation by ID
const getDonationByDonor = async (req, res) => {
  const donorId = req.params.id;
  try {
    const donation = await prisma.donation.findMany({
      where: { donorId },
    });
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

// Update a donation
const updateDonation = async (req, res) => {
  const { id } = req.params;
  const { donor, campaignId, amount, transactionHash } = req.body;
  try {
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        donor,
        campaignId,
        amount,
        transactionHash,
      },
    });
    res.status(200).json(updatedDonation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update donation" });
  }
};

// Delete a donation
const deleteDonation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.donation.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete donation" });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getDonationByDonor,
  updateDonation,
  deleteDonation,
};