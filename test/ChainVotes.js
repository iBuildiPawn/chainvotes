const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainVotes", function () {
  let chainVotes;
  let owner;
  let admin;
  let voter1;
  let voter2;
  let addrs;

  // Constants for testing
  const CAMPAIGN_NAME = "Presidential Election 2024";
  const CAMPAIGN_DESCRIPTION = "Vote for the next president";
  const POSITION_NAME = "President";
  const POSITION_DESCRIPTION = "Head of State";
  const CANDIDATE1_NAME = "John Doe";
  const CANDIDATE1_DESCRIPTION = "Candidate 1 Description";
  const CANDIDATE2_NAME = "Jane Smith";
  const CANDIDATE2_DESCRIPTION = "Candidate 2 Description";

  // Helper function to get timestamp
  const getTimestamp = async () => {
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    return block.timestamp;
  };

  beforeEach(async function () {
    // Get signers
    [owner, admin, voter1, voter2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const ChainVotes = await ethers.getContractFactory("ChainVotes");
    chainVotes = await ChainVotes.deploy();
    await chainVotes.waitForDeployment();

    // Add admin
    await chainVotes.addAdmin(admin.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await chainVotes.owner()).to.equal(owner.address);
    });

    it("Should add owner as admin", async function () {
      expect(await chainVotes.isAdmin(owner.address)).to.equal(true);
    });
  });

  describe("Admin Management", function () {
    it("Should allow owner to add admin", async function () {
      await chainVotes.addAdmin(addrs[0].address);
      expect(await chainVotes.isAdmin(addrs[0].address)).to.equal(true);
    });

    it("Should allow owner to remove admin", async function () {
      await chainVotes.removeAdmin(admin.address);
      expect(await chainVotes.isAdmin(admin.address)).to.equal(false);
    });

    it("Should not allow non-owner to add admin", async function () {
      await expect(
        chainVotes.connect(admin).addAdmin(addrs[0].address)
      ).to.be.revertedWithCustomError(chainVotes, "OwnableUnauthorizedAccount");
    });

    it("Should not allow removing owner as admin", async function () {
      await expect(
        chainVotes.removeAdmin(owner.address)
      ).to.be.revertedWith("Cannot remove owner as admin");
    });
  });

  describe("Campaign Management", function () {
    let startTime, endTime, campaignId;

    beforeEach(async function () {
      const currentTime = await getTimestamp();
      startTime = currentTime + 3600; // 1 hour from now
      endTime = currentTime + 86400; // 24 hours from now

      // Create a campaign
      const tx = await chainVotes.connect(admin).createCampaign(
        CAMPAIGN_NAME,
        CAMPAIGN_DESCRIPTION,
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      
      // Get campaign ID from event
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CampaignCreated"
      );
      campaignId = event.args[0];
    });

    it("Should create a campaign correctly", async function () {
      const campaignDetails = await chainVotes.getCampaignDetails(campaignId);
      expect(campaignDetails.name).to.equal(CAMPAIGN_NAME);
      expect(campaignDetails.description).to.equal(CAMPAIGN_DESCRIPTION);
      expect(campaignDetails.startTime).to.equal(startTime);
      expect(campaignDetails.endTime).to.equal(endTime);
      expect(campaignDetails.isActive).to.equal(true);
      expect(campaignDetails.voterCount).to.equal(0);
    });

    it("Should allow admin to change campaign status", async function () {
      await chainVotes.connect(admin).setCampaignStatus(campaignId, false);
      const campaignDetails = await chainVotes.getCampaignDetails(campaignId);
      expect(campaignDetails.isActive).to.equal(false);
    });

    it("Should not allow non-admin to create campaign", async function () {
      await expect(
        chainVotes.connect(voter1).createCampaign(
          CAMPAIGN_NAME,
          CAMPAIGN_DESCRIPTION,
          startTime,
          endTime
        )
      ).to.be.revertedWith("Not authorized: caller is not an admin");
    });
  });

  describe("Position and Candidate Management", function () {
    let campaignId, positionId;

    beforeEach(async function () {
      const currentTime = await getTimestamp();
      const startTime = currentTime + 3600; // 1 hour from now
      const endTime = currentTime + 86400; // 24 hours from now

      // Create a campaign
      const tx = await chainVotes.connect(admin).createCampaign(
        CAMPAIGN_NAME,
        CAMPAIGN_DESCRIPTION,
        startTime,
        endTime
      );
      const receipt = await tx.wait();
      
      // Get campaign ID from event
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CampaignCreated"
      );
      campaignId = event.args[0];

      // Add a position
      const positionTx = await chainVotes.connect(admin).addPosition(
        campaignId,
        POSITION_NAME,
        POSITION_DESCRIPTION
      );
      const positionReceipt = await positionTx.wait();
      
      // Get position ID from event
      const positionEvent = positionReceipt.logs.find(
        (log) => log.fragment && log.fragment.name === "PositionCreated"
      );
      positionId = positionEvent.args[1];
    });

    it("Should add a position correctly", async function () {
      const positionDetails = await chainVotes.getPositionDetails(campaignId, positionId);
      expect(positionDetails.name).to.equal(POSITION_NAME);
      expect(positionDetails.description).to.equal(POSITION_DESCRIPTION);
    });

    it("Should add candidates correctly", async function () {
      // Add candidate 1
      const candidate1Tx = await chainVotes.connect(admin).addCandidate(
        campaignId,
        positionId,
        CANDIDATE1_NAME,
        CANDIDATE1_DESCRIPTION
      );
      const candidate1Receipt = await candidate1Tx.wait();
      
      // Get candidate ID from event
      const candidate1Event = candidate1Receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CandidateCreated"
      );
      const candidate1Id = candidate1Event.args[2];

      // Add candidate 2
      const candidate2Tx = await chainVotes.connect(admin).addCandidate(
        campaignId,
        positionId,
        CANDIDATE2_NAME,
        CANDIDATE2_DESCRIPTION
      );
      const candidate2Receipt = await candidate2Tx.wait();
      
      // Get candidate ID from event
      const candidate2Event = candidate2Receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CandidateCreated"
      );
      const candidate2Id = candidate2Event.args[2];

      // Check candidate 1 details
      const candidate1Details = await chainVotes.getCandidateDetails(campaignId, positionId, candidate1Id);
      expect(candidate1Details.name).to.equal(CANDIDATE1_NAME);
      expect(candidate1Details.description).to.equal(CANDIDATE1_DESCRIPTION);
      expect(candidate1Details.voteCount).to.equal(0);

      // Check candidate 2 details
      const candidate2Details = await chainVotes.getCandidateDetails(campaignId, positionId, candidate2Id);
      expect(candidate2Details.name).to.equal(CANDIDATE2_NAME);
      expect(candidate2Details.description).to.equal(CANDIDATE2_DESCRIPTION);
      expect(candidate2Details.voteCount).to.equal(0);
    });

    it("Should not allow non-admin to add position", async function () {
      await expect(
        chainVotes.connect(voter1).addPosition(
          campaignId,
          POSITION_NAME,
          POSITION_DESCRIPTION
        )
      ).to.be.revertedWith("Not authorized: caller is not an admin");
    });

    it("Should not allow non-admin to add candidate", async function () {
      await expect(
        chainVotes.connect(voter1).addCandidate(
          campaignId,
          positionId,
          CANDIDATE1_NAME,
          CANDIDATE1_DESCRIPTION
        )
      ).to.be.revertedWith("Not authorized: caller is not an admin");
    });
  });

  describe("Voting", function () {
    let campaignId, positionId, candidate1Id, candidate2Id;
    let startTime, endTime;

    beforeEach(async function () {
      const currentTime = await getTimestamp();
      startTime = currentTime + 60; // 1 minute from now
      endTime = currentTime + 86400; // 24 hours from now

      // Create a campaign
      const campaignTx = await chainVotes.connect(admin).createCampaign(
        CAMPAIGN_NAME,
        CAMPAIGN_DESCRIPTION,
        startTime,
        endTime
      );
      const campaignReceipt = await campaignTx.wait();
      
      // Get campaign ID from event
      const campaignEvent = campaignReceipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CampaignCreated"
      );
      campaignId = campaignEvent.args[0];

      // Add a position
      const positionTx = await chainVotes.connect(admin).addPosition(
        campaignId,
        POSITION_NAME,
        POSITION_DESCRIPTION
      );
      const positionReceipt = await positionTx.wait();
      
      // Get position ID from event
      const positionEvent = positionReceipt.logs.find(
        (log) => log.fragment && log.fragment.name === "PositionCreated"
      );
      positionId = positionEvent.args[1];

      // Add candidate 1
      const candidate1Tx = await chainVotes.connect(admin).addCandidate(
        campaignId,
        positionId,
        CANDIDATE1_NAME,
        CANDIDATE1_DESCRIPTION
      );
      const candidate1Receipt = await candidate1Tx.wait();
      
      // Get candidate ID from event
      const candidate1Event = candidate1Receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CandidateCreated"
      );
      candidate1Id = candidate1Event.args[2];

      // Add candidate 2
      const candidate2Tx = await chainVotes.connect(admin).addCandidate(
        campaignId,
        positionId,
        CANDIDATE2_NAME,
        CANDIDATE2_DESCRIPTION
      );
      const candidate2Receipt = await candidate2Tx.wait();
      
      // Get candidate ID from event
      const candidate2Event = candidate2Receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "CandidateCreated"
      );
      candidate2Id = candidate2Event.args[2];

      // Advance time to start the campaign
      await ethers.provider.send("evm_increaseTime", [61]); // 61 seconds
      await ethers.provider.send("evm_mine");
    });

    it("Should allow voter to cast vote", async function () {
      // Cast vote
      await chainVotes.connect(voter1).castVote(campaignId, positionId, candidate1Id);
      
      // Check vote count
      const candidate1Details = await chainVotes.getCandidateDetails(campaignId, positionId, candidate1Id);
      expect(candidate1Details.voteCount).to.equal(1);
      
      // Check voter status
      expect(await chainVotes.hasVoted(campaignId, voter1.address)).to.equal(true);
      
      // Check campaign voter count
      const campaignDetails = await chainVotes.getCampaignDetails(campaignId);
      expect(campaignDetails.voterCount).to.equal(1);
    });

    it("Should not allow voter to vote twice", async function () {
      // Cast vote
      await chainVotes.connect(voter1).castVote(campaignId, positionId, candidate1Id);
      
      // Try to vote again
      await expect(
        chainVotes.connect(voter1).castVote(campaignId, positionId, candidate2Id)
      ).to.be.revertedWith("You have already voted in this campaign");
    });

    it("Should not allow voting in inactive campaign", async function () {
      // Deactivate campaign
      await chainVotes.connect(admin).setCampaignStatus(campaignId, false);
      
      // Try to vote
      await expect(
        chainVotes.connect(voter1).castVote(campaignId, positionId, candidate1Id)
      ).to.be.revertedWith("Campaign is not active");
    });

    it("Should not allow voting after campaign ends", async function () {
      // Advance time to end the campaign
      await ethers.provider.send("evm_increaseTime", [86401]); // 24 hours + 1 second
      await ethers.provider.send("evm_mine");
      
      // Try to vote
      await expect(
        chainVotes.connect(voter1).castVote(campaignId, positionId, candidate1Id)
      ).to.be.revertedWith("Campaign has ended");
    });
  });
});