// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ChainVotes
 * @dev A blockchain-based voting system that allows admins to create campaigns, positions, and candidates,
 * and for voters to cast votes securely.
 */
contract ChainVotes is Ownable, ReentrancyGuard {
    // Structs
    struct Campaign {
        uint256 id;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(uint256 => Position) positions;
        uint256[] positionIds;
        mapping(address => bool) voters;
        uint256 voterCount;
    }

    struct Position {
        uint256 id;
        string name;
        string description;
        mapping(uint256 => Candidate) candidates;
        uint256[] candidateIds;
    }

    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
    }

    // State variables
    uint256 private campaignIdCounter;
    uint256 private positionIdCounter;
    uint256 private candidateIdCounter;
    mapping(uint256 => Campaign) public campaigns;
    uint256[] public campaignIds;
    mapping(address => bool) public admins;

    // Events
    event CampaignCreated(uint256 indexed campaignId, string name, uint256 startTime, uint256 endTime);
    event PositionCreated(uint256 indexed campaignId, uint256 indexed positionId, string name);
    event CandidateCreated(uint256 indexed campaignId, uint256 indexed positionId, uint256 indexed candidateId, string name);
    event VoteCast(uint256 indexed campaignId, uint256 indexed positionId, uint256 indexed candidateId, address voter);
    event CampaignStatusChanged(uint256 indexed campaignId, bool isActive);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    // Modifiers
    modifier onlyAdmin() {
        require(admins[msg.sender] || owner() == msg.sender, "Not authorized: caller is not an admin");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignIdCounter, "Campaign does not exist");
        _;
    }

    modifier positionExists(uint256 _campaignId, uint256 _positionId) {
        require(_positionId > 0, "Position ID must be greater than 0");
        bool exists = false;
        for (uint256 i = 0; i < campaigns[_campaignId].positionIds.length; i++) {
            if (campaigns[_campaignId].positionIds[i] == _positionId) {
                exists = true;
                break;
            }
        }
        require(exists, "Position does not exist in this campaign");
        _;
    }

    modifier candidateExists(uint256 _campaignId, uint256 _positionId, uint256 _candidateId) {
        require(_candidateId > 0, "Candidate ID must be greater than 0");
        bool exists = false;
        for (uint256 i = 0; i < campaigns[_campaignId].positions[_positionId].candidateIds.length; i++) {
            if (campaigns[_campaignId].positions[_positionId].candidateIds[i] == _candidateId) {
                exists = true;
                break;
            }
        }
        require(exists, "Candidate does not exist in this position");
        _;
    }

    modifier campaignIsActive(uint256 _campaignId) {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        require(block.timestamp >= campaigns[_campaignId].startTime, "Campaign has not started yet");
        require(block.timestamp <= campaigns[_campaignId].endTime, "Campaign has ended");
        _;
    }

    modifier hasNotVoted(uint256 _campaignId) {
        require(!campaigns[_campaignId].voters[msg.sender], "You have already voted in this campaign");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        // Initialize counters
        campaignIdCounter = 0;
        positionIdCounter = 0;
        candidateIdCounter = 0;
        
        // Add contract deployer as admin
        admins[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }

    // Admin management functions
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        require(!admins[_admin], "Address is already an admin");
        
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Address is not an admin");
        require(_admin != owner(), "Cannot remove owner as admin");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Campaign management functions
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");

        campaignIdCounter++;
        uint256 campaignId = campaignIdCounter;
        
        Campaign storage newCampaign = campaigns[campaignId];
        newCampaign.id = campaignId;
        newCampaign.name = _name;
        newCampaign.description = _description;
        newCampaign.startTime = _startTime;
        newCampaign.endTime = _endTime;
        newCampaign.isActive = true;
        newCampaign.voterCount = 0;
        
        campaignIds.push(campaignId);
        
        emit CampaignCreated(campaignId, _name, _startTime, _endTime);
        
        return campaignId;
    }

    function setCampaignStatus(uint256 _campaignId, bool _isActive) 
        external 
        onlyAdmin 
        campaignExists(_campaignId) 
    {
        campaigns[_campaignId].isActive = _isActive;
        emit CampaignStatusChanged(_campaignId, _isActive);
    }

    // Position management functions
    function addPosition(
        uint256 _campaignId,
        string memory _name,
        string memory _description
    ) 
        external 
        onlyAdmin 
        campaignExists(_campaignId) 
        returns (uint256) 
    {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        positionIdCounter++;
        uint256 positionId = positionIdCounter;
        
        Position storage newPosition = campaigns[_campaignId].positions[positionId];
        newPosition.id = positionId;
        newPosition.name = _name;
        newPosition.description = _description;
        
        campaigns[_campaignId].positionIds.push(positionId);
        
        emit PositionCreated(_campaignId, positionId, _name);
        
        return positionId;
    }

    // Candidate management functions
    function addCandidate(
        uint256 _campaignId,
        uint256 _positionId,
        string memory _name,
        string memory _description
    ) 
        external 
        onlyAdmin 
        campaignExists(_campaignId)
        positionExists(_campaignId, _positionId)
        returns (uint256) 
    {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        candidateIdCounter++;
        uint256 candidateId = candidateIdCounter;
        
        Candidate storage newCandidate = campaigns[_campaignId].positions[_positionId].candidates[candidateId];
        newCandidate.id = candidateId;
        newCandidate.name = _name;
        newCandidate.description = _description;
        newCandidate.voteCount = 0;
        
        campaigns[_campaignId].positions[_positionId].candidateIds.push(candidateId);
        
        emit CandidateCreated(_campaignId, _positionId, candidateId, _name);
        
        return candidateId;
    }

    // Voting functions
    function castVote(
        uint256 _campaignId,
        uint256 _positionId,
        uint256 _candidateId
    ) 
        external 
        nonReentrant
        campaignExists(_campaignId)
        positionExists(_campaignId, _positionId)
        candidateExists(_campaignId, _positionId, _candidateId)
        campaignIsActive(_campaignId)
        hasNotVoted(_campaignId)
    {
        // Mark voter as having voted
        campaigns[_campaignId].voters[msg.sender] = true;
        campaigns[_campaignId].voterCount++;
        
        // Increment candidate vote count
        campaigns[_campaignId].positions[_positionId].candidates[_candidateId].voteCount++;
        
        emit VoteCast(_campaignId, _positionId, _candidateId, msg.sender);
    }

    // View functions
    function getCampaignCount() external view returns (uint256) {
        return campaignIds.length;
    }
    
    function getCampaignDetails(uint256 _campaignId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (
            string memory name,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 voterCount,
            uint256[] memory positionIds
        ) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.name,
            campaign.description,
            campaign.startTime,
            campaign.endTime,
            campaign.isActive,
            campaign.voterCount,
            campaign.positionIds
        );
    }
    
    function getPositionDetails(uint256 _campaignId, uint256 _positionId) 
        external 
        view 
        campaignExists(_campaignId)
        positionExists(_campaignId, _positionId)
        returns (
            string memory name,
            string memory description,
            uint256[] memory candidateIds
        ) 
    {
        Position storage position = campaigns[_campaignId].positions[_positionId];
        return (
            position.name,
            position.description,
            position.candidateIds
        );
    }
    
    function getCandidateDetails(uint256 _campaignId, uint256 _positionId, uint256 _candidateId) 
        external 
        view 
        campaignExists(_campaignId)
        positionExists(_campaignId, _positionId)
        candidateExists(_campaignId, _positionId, _candidateId)
        returns (
            string memory name,
            string memory description,
            uint256 voteCount
        ) 
    {
        Candidate storage candidate = campaigns[_campaignId].positions[_positionId].candidates[_candidateId];
        return (
            candidate.name,
            candidate.description,
            candidate.voteCount
        );
    }
    
    function hasVoted(uint256 _campaignId, address _voter) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (bool) 
    {
        return campaigns[_campaignId].voters[_voter];
    }
    
    function isAdmin(address _address) external view returns (bool) {
        return admins[_address] || _address == owner();
    }
}