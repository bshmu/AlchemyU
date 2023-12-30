require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    goerli: {url: process.env.TESTNET_RPC_URL, accounts: [process.env.PRIVATE_KEY]}}
};
