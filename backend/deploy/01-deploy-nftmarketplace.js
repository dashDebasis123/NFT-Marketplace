const { network } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { ethers } = require("hardhat");
const fs = require('fs');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("----------------------------------------------------");
    const arguments = [];
    const nftMarketplace = await deploy("NFTMarketplace", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(nftMarketplace.address, arguments);
    }
    log("----------------------------------------------------");

    // Get contract interface after deployment
    const nftMarketplaceContract = await ethers.getContractAt("NFTMarketplace", nftMarketplace.address);
    
    const data = {
        address: nftMarketplace.address,
        abi: nftMarketplaceContract.interface.format('json'), // Access interface directly
    };
    
    // This writes the ABI and address to the mktplace.json
    fs.writeFileSync('./Marketplace.json', JSON.stringify(data));
};

module.exports.tags = ["all", "nftmarketplace"];
