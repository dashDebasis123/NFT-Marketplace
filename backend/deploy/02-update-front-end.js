const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}


async function updateAbi() {
    const nftmarketplace = await ethers.getContract("NFTMarketplace")
    fs.writeFileSync(frontEndAbiFile, nftmarketplace.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const nftmarketplace = await ethers.getContract("NFTMarketplace")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(nftmarketplace.address)) {
            contractAddresses[network.config.chainId.toString()]=nftmarketplace.address
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [nftmarketplace.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]

