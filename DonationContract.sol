// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SecureDonation {
    address public owner;
    uint256 public totalDonations;
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    struct Campaign {
        string name;
        address payable recipient;
        uint256 goal;
        uint256 fundsRaised;
        bool isCompleted;
    }
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public donations;
    uint256 public campaignCount;

    event DonationReceived(address indexed donor, uint256 indexed campaignId, uint256 amount);
    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(string memory _name, address payable _recipient, uint256 _goal) external onlyOwner {
        campaignCount++;
        campaigns[campaignCount] = Campaign(_name, _recipient, _goal, 0, false);
    }
    
    function donate(uint256 _campaignId) external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.isCompleted, "Campaign is already completed");
        
        campaign.fundsRaised += msg.value;
        totalDonations += msg.value;
        
        donations[_campaignId].push(Donation(msg.sender, msg.value, block.timestamp));
        emit DonationReceived(msg.sender, _campaignId, msg.value);
    }
    
    function releaseFunds(uint256 _campaignId) external onlyOwner {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundsRaised >= campaign.goal, "Goal not yet reached");
        require(!campaign.isCompleted, "Funds already released");
        
        campaign.isCompleted = true;
        campaign.recipient.transfer(campaign.fundsRaised);
        emit FundsReleased(_campaignId, campaign.fundsRaised);
    }
    
    function getCampaignDetails(uint256 _campaignId) external view returns (string memory, uint256, uint256, bool) {
        Campaign storage campaign = campaigns[_campaignId];
        return (campaign.name, campaign.goal, campaign.fundsRaised, campaign.isCompleted);
    }
}