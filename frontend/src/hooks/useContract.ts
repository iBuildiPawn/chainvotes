'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';

// ABI for the ChainVotes contract
const ABI = [
  // Events
  "event CampaignCreated(uint256 indexed campaignId, string name, uint256 startTime, uint256 endTime)",
  "event PositionCreated(uint256 indexed campaignId, uint256 indexed positionId, string name)",
  "event CandidateCreated(uint256 indexed campaignId, uint256 indexed positionId, uint256 indexed candidateId, string name)",
  "event VoteCast(uint256 indexed campaignId, uint256 indexed positionId, uint256 indexed candidateId, address voter)",
  "event CampaignStatusChanged(uint256 indexed campaignId, bool isActive)",
  "event AdminAdded(address indexed admin)",
  "event AdminRemoved(address indexed admin)",
  
  // Admin functions
  "function addAdmin(address _admin) external",
  "function removeAdmin(address _admin) external",
  "function isAdmin(address _address) external view returns (bool)",
  
  // Campaign functions
  "function createCampaign(string memory _name, string memory _description, uint256 _startTime, uint256 _endTime) external returns (uint256)",
  "function setCampaignStatus(uint256 _campaignId, bool _isActive) external",
  "function addPosition(uint256 _campaignId, string memory _name, string memory _description) external returns (uint256)",
  "function addCandidate(uint256 _campaignId, uint256 _positionId, string memory _name, string memory _description) external returns (uint256)",
  "function castVote(uint256 _campaignId, uint256 _positionId, uint256 _candidateId) external",
  
  // View functions
  "function getCampaignCount() external view returns (uint256)",
  "function getCampaignDetails(uint256 _campaignId) external view returns (string memory name, string memory description, uint256 startTime, uint256 endTime, bool isActive, uint256 voterCount, uint256[] memory positionIds)",
  "function getPositionDetails(uint256 _campaignId, uint256 _positionId) external view returns (string memory name, string memory description, uint256[] memory candidateIds)",
  "function getCandidateDetails(uint256 _campaignId, uint256 _positionId, uint256 _candidateId) external view returns (string memory name, string memory description, uint256 voteCount)",
  "function hasVoted(uint256 _campaignId, address _voter) external view returns (bool)",
  "function campaignIds(uint256) external view returns (uint256)"
];

// Contract address (should be in environment variables)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useContract() {
  const { isConnected, address } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Create provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Create read-only contract instance
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
          setContract(contract);

          // If connected, create signer and contract with signer
          if (isConnected && address) {
            const signer = await provider.getSigner();
            setSigner(signer);
            setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
          }
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      }
    };

    initContract();
  }, [isConnected, address]);

  return { contract, signer, provider };
}