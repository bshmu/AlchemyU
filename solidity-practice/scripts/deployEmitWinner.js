const hre = require('hardhat')

async function main () {
  const EmitWinner = await hre.ethers.getContractFactory('EmitWinner');
  const emitWinner = await EmitWinner.deploy();

  const addressWinnerContract = '0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502';

  // Call the "attempt" method of Winner Contract through the interface inside our Contract
  const result = await emitWinner.sendAttempt(addressWinnerContract);
  console.log(result);
  console.log(`Contract deployed to ${emitWinner.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})