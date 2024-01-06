import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function addContract(
  id,
  contract,
  arbiter,
  beneficiary,
  valueInEther
) {
  const buttonId = `approve-${id}`;
  const balanceId = `balance-${id}`;

  const balanceInWei = await contract.getBalance();
  const balanceInEther = ethers.utils.formatEther(balanceInWei);

  const container = document.getElementById('container');
  container.innerHTML += createHTML(buttonId, arbiter, beneficiary, valueInEther, balanceInEther);

  contract.on('Approved', () => {
    document.getElementById(buttonId).className = 'complete';
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
  });

  document.getElementById(buttonId).addEventListener('click', async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).approve();
  });
}

function createHTML(buttonId, balanceId, arbiter, beneficiary, valueInEther, balanceInEther) {
  const valueInEther = ethers.utils.formatEther(value);
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${valueInEther} ETH </div>
        </li>
        <li>
          <div> Current Balance </div>
          <div id="${balanceId}"> ${balanceInEther} ETH </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}
