const express = require("express");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  getCampaignByOrgId,
  deleteCampaign,
  approveCampaign,
} = require("../controllers/campaignController");

const router = express.Router();

// CRUD routes for campaigns
router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.put("/:id", approveCampaign);
router.delete("/:id", deleteCampaign);
router.post("/myCampaigns", getCampaignByOrgId);
router.post("/:id", updateCampaign);

module.exports = router;    