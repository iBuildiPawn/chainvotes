// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Deploying ChainVotes contract...");

  // Deploy the ChainVotes contract
  const ChainVotes = await hre.ethers.getContractFactory("ChainVotes");
  const chainVotes = await ChainVotes.deploy();

  await chainVotes.waitForDeployment();

  const address = await chainVotes.getAddress();
  console.log(`ChainVotes deployed to: ${address}`);

  // For testnets and mainnet, you might want to verify the contract
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    // Wait for 6 block confirmations
    await chainVotes.deploymentTransaction().wait(6);
    
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified");
  }

  return { chainVotes, address };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});