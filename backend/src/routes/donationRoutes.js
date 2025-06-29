const express = require("express");
const {
  createDonation,
  getDonations,
  getDonationByDonor,
  updateDonation,
  deleteDonation
} = require("../controllers/donationController");

const router = express.Router();

// CRUD routes for donations
router.post("/", createDonation);
router.get("/", getDonations);
router.get("/:id", getDonationByDonor);
router.put("/:id", updateDonation);
router.delete("/:id", deleteDonation);

module.exports = router;