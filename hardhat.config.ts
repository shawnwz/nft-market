//require("@nomiclabs/hardhat-waffle");
import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
//require("@dotenv")

dotenv.config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();
//
//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/93faa0baeedd4e33867a82bb9a4f6950`,
      accounts: [`130fcb97168b682f571d135d8eb029a32cf2142078e39d2745d2bfe319296a49`],
      gas: 2100000,
      gasPrice: 8000000000
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/93faa0baeedd4e33867a82bb9a4f6950`,
      accounts: [`130fcb97168b682f571d135d8eb029a32cf2142078e39d2745d2bfe319296a49`]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/93faa0baeedd4e33867a82bb9a4f6950`,
      accounts: [`130fcb97168b682f571d135d8eb029a32cf2142078e39d2745d2bfe319296a49`]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.DEPLOYER_ROPSTEN_PRIVATE_KEY}`],
    }
  },
  solidity: "0.8.4",
};
