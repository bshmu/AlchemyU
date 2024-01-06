import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowABI from './artifacts/contracts/Escrow.sol/Escrow.json'

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [selectedContract, setSelectedContract] = useState(null);
  const [lastDeposit, setLastDeposit] = useState(Date.now());

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const valueInEther = document.getElementById('eth').value;
    const value = ethers.utils.parseEther(valueInEther);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      contract: escrowContract,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className = 'complete';
          document.getElementById(escrowContract.address).innerText = "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  function handleDeposit() {
    const depositAmount = document.getElementById('depositAmount').value;
    const selectedContractAddress = document.getElementById('contractSelect').value;
    depositToContract(selectedContractAddress, depositAmount);
  }

  async function depositToContract(contractAddress, amountInEther) {
    try {
      const amountInWei = ethers.utils.parseEther(amountInEther);
      const escrowContract = new ethers.Contract(contractAddress, EscrowABI.abi, signer);
  
      const tx = await escrowContract.deposit({ value: amountInWei });
      await tx.wait();
      
      setLastDeposit(Date.now());  // Update lastDeposit after a successful deposit
      console.log(`Deposited ${amountInEther} ETH to contract at address ${contractAddress}`);
    } catch (error) {
      console.error('Error making a deposit:', error);
    }
  }

  function handleContractSelect(contractAddress) {
    setSelectedContract(contractAddress);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>
        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>
        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>
        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>
      
      <div className="deposit">
        <h1>Make a Deposit</h1>
        <select id="contractSelect">
          {escrows.map((escrow, index) => (
            <option key={index} value={escrow.address}>
              Contract {index + 1} - {escrow.address}
            </option>
          ))}
        </select>
        <div>
          <input type="text" id="depositAmount" placeholder="Amount in Ether"/>
        </div>
        <div>
          <button className="button" onClick={handleDeposit}>Deposit</button>
        </div>
      </div>

      <div className="existing-contracts">
      <h1> Existing Contracts </h1>
      <div id="container">
        {escrows.map((escrow) => {
          return (
            <Escrow 
              key={escrow.address} 
              escrowContract={escrow.contract}
              {...escrow}
              lastDeposit={lastDeposit}
              isSelected={escrow.address === selectedContract}
              handleSelect={() => handleContractSelect(escrow.address)}
            />
          );
        })}
      </div>
    </div>
    </>
  );
}

export default App