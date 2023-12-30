const hre = require("hardhat");
const ethers = require('ethers');
require('dotenv').config();

const CONTRACT_ADDRESS = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";

async function main() {

  const contract = await hre.ethers.getContractAt("Contract", CONTRACT_ADDRESS);
  const tx = await contract.attempt();
  await tx.wait();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});