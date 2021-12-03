// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const Factory721 = await hre.ethers.getContractFactory("Factory721");
    const factory721 = await Factory721.deploy();
    await factory721.deployed();
    console.log("nft factory 721 deployed to:", factory721.address);

    const NFT721 = await hre.ethers.getContractFactory("NFT721");
    const nft721 = await NFT721.deploy(factory721.address);
    await nft721.deployed();
    console.log("nft 721 deployed to:", nft721.address);

    let config = `export const nftfactoryaddress = "${factory721.address}" export const nft721address = "${nft721.address}"`

    let data = JSON.stringify(config)
    fs.writeFileSync('config.js', JSON.parse(data))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
