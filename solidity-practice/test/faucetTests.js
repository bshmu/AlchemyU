const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
// const ethers = require('ethers');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();
    const [owner, notOwner] = await ethers.getSigners();
    console.log('Signer 1 address: ', owner.address);

    let withdrawAmount = ethers.parseUnits('1', 'ether');

    return { faucet, owner, notOwner, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow a withdrawal > 0.1 ETH', async function () {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should block withdrawAll for a not-owner user', async function () {
    const { faucet, notOwner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(notOwner).withdrawAll()).to.be.reverted;
  });

  it('should block destroyFaucet for a not-owner user', async function () {
    const { faucet, notOwner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(notOwner).destroyFaucet()).to.be.reverted;
  });

});