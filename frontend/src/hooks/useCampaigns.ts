'use client';

import { useState, useCallback } from 'react';
import { useContract } from './useContract';
import { useWeb3 } from '@/contexts/Web3Context';
import toast from 'react-hot-toast';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  voterCount: number;
  positionIds: number[];
}

export interface Position {
  id: number;
  name: string;
  description: string;
  candidateIds: number[];
}

export interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}

export function useCampaigns() {
  const { contract } = useContract();
  const { address } = useWeb3();
  const [loading, setLoading] = useState(false);

  // Get all campaigns
  const getCampaigns = useCallback(async (): Promise<Campaign[]> => {
    if (!contract) return [];
    
    setLoading(true);
    try {
      const campaignCount = await contract.getCampaignCount();
      const campaigns: Campaign[] = [];
      
      for (let i = 0; i < campaignCount; i++) {
        const campaignId = await contract.campaignIds(i);
        const campaign = await getCampaign(campaignId);
        if (campaign) {
          campaigns.push(campaign);
        }
      }
      
      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to fetch campaigns');
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Get a single campaign by ID
  const getCampaign = useCallback(async (campaignId: number): Promise<Campaign | null> => {
    if (!contract) return null;
    
    try {
      const [name, description, startTime, endTime, isActive, voterCount, positionIds] = 
        await contract.getCampaignDetails(campaignId);
      
      return {
        id: campaignId,
        name,
        description,
        startTime: new Date(Number(startTime) * 1000),
        endTime: new Date(Number(endTime) * 1000),
        isActive,
        voterCount: Number(voterCount),
        positionIds: positionIds.map((id: any) => Number(id)),
      };
    } catch (error) {
      console.error(`Error fetching campaign ${campaignId}:`, error);
      return null;
    }
  }, [contract]);

  // Get positions for a campaign
  const getPositions = useCallback(async (campaignId: number): Promise<Position[]> => {
    if (!contract) return [];
    
    try {
      const campaign = await getCampaign(campaignId);
      if (!campaign) return [];
      
      const positions: Position[] = [];
      for (const positionId of campaign.positionIds) {
        const [name, description, candidateIds] = await contract.getPositionDetails(campaignId, positionId);
        
        positions.push({
          id: positionId,
          name,
          description,
          candidateIds: candidateIds.map((id: any) => Number(id)),
        });
      }
      
      return positions;
    } catch (error) {
      console.error(`Error fetching positions for campaign ${campaignId}:`, error);
      toast.error('Failed to fetch positions');
      return [];
    }
  }, [contract, getCampaign]);

  // Get candidates for a position
  const getCandidates = useCallback(async (campaignId: number, positionId: number): Promise<Candidate[]> => {
    if (!contract) return [];
    
    try {
      const [, , candidateIds] = await contract.getPositionDetails(campaignId, positionId);
      
      const candidates: Candidate[] = [];
      for (const candidateId of candidateIds) {
        const [name, description, voteCount] = await contract.getCandidateDetails(campaignId, positionId, candidateId);
        
        candidates.push({
          id: Number(candidateId),
          name,
          description,
          voteCount: Number(voteCount),
        });
      }
      
      return candidates;
    } catch (error) {
      console.error(`Error fetching candidates for position ${positionId}:`, error);
      toast.error('Failed to fetch candidates');
      return [];
    }
  }, [contract]);

  // Create a new campaign
  const createCampaign = useCallback(async (
    name: string,
    description: string,
    startTime: Date,
    endTime: Date
  ): Promise<number | null> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return null;
    }
    
    setLoading(true);
    try {
      const startTimestamp = Math.floor(startTime.getTime() / 1000);
      const endTimestamp = Math.floor(endTime.getTime() / 1000);
      
      const tx = await contract.createCampaign(name, description, startTimestamp, endTimestamp);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === "CampaignCreated"
      );
      
      if (event) {
        const campaignId = Number(event.args[0]);
        toast.success('Campaign created successfully');
        return campaignId;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Add a position to a campaign
  const addPosition = useCallback(async (
    campaignId: number,
    name: string,
    description: string
  ): Promise<number | null> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return null;
    }
    
    setLoading(true);
    try {
      const tx = await contract.addPosition(campaignId, name, description);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === "PositionCreated"
      );
      
      if (event) {
        const positionId = Number(event.args[1]);
        toast.success('Position added successfully');
        return positionId;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding position:', error);
      toast.error('Failed to add position');
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Add a candidate to a position
  const addCandidate = useCallback(async (
    campaignId: number,
    positionId: number,
    name: string,
    description: string
  ): Promise<number | null> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return null;
    }
    
    setLoading(true);
    try {
      const tx = await contract.addCandidate(campaignId, positionId, name, description);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === "CandidateCreated"
      );
      
      if (event) {
        const candidateId = Number(event.args[2]);
        toast.success('Candidate added successfully');
        return candidateId;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Failed to add candidate');
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Cast a vote
  const castVote = useCallback(async (
    campaignId: number,
    positionId: number,
    candidateId: number
  ): Promise<boolean> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return false;
    }
    
    setLoading(true);
    try {
      // Check if user has already voted
      const hasVotedAlready = await hasVoted(campaignId);
      if (hasVotedAlready) {
        toast.error('You have already voted in this campaign');
        return false;
      }
      
      const tx = await contract.castVote(campaignId, positionId, candidateId);
      await tx.wait();
      
      toast.success('Vote cast successfully');
      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Set campaign status (activate/deactivate)
  const setCampaignStatus = useCallback(async (
    campaignId: number,
    isActive: boolean
  ): Promise<boolean> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return false;
    }
    
    setLoading(true);
    try {
      const tx = await contract.setCampaignStatus(campaignId, isActive);
      await tx.wait();
      
      toast.success(`Campaign ${isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error) {
      console.error('Error setting campaign status:', error);
      toast.error('Failed to update campaign status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Check if a user has voted in a campaign
  const hasVoted = useCallback(async (campaignId: number): Promise<boolean> => {
    if (!contract || !address) return false;
    
    try {
      return await contract.hasVoted(campaignId, address);
    } catch (error) {
      console.error('Error checking if user has voted:', error);
      return false;
    }
  }, [contract, address]);

  // Add an admin
  const addAdmin = useCallback(async (adminAddress: string): Promise<boolean> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return false;
    }
    
    setLoading(true);
    try {
      const tx = await contract.addAdmin(adminAddress);
      await tx.wait();
      
      toast.success('Admin added successfully');
      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Remove an admin
  const removeAdmin = useCallback(async (adminAddress: string): Promise<boolean> => {
    if (!contract) {
      toast.error('Contract not initialized');
      return false;
    }
    
    setLoading(true);
    try {
      const tx = await contract.removeAdmin(adminAddress);
      await tx.wait();
      
      toast.success('Admin removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // Check if an address is an admin
  const isAdmin = useCallback(async (adminAddress: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      return await contract.isAdmin(adminAddress);
    } catch (error) {
      console.error('Error checking if address is admin:', error);
      return false;
    }
  }, [contract]);

  return {
    loading,
    getCampaigns,
    getCampaign,
    getPositions,
    getCandidates,
    createCampaign,
    addPosition,
    addCandidate,
    castVote,
    setCampaignStatus,
    hasVoted,
    addAdmin,
    removeAdmin,
    isAdmin,
  };
}