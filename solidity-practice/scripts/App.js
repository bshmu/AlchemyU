import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import abi from './artifacts/contracts/Escrow.sol/Escrow.json';
import Escrow from './Escrow';

export async function approve(escrowContract, signer, txnId) {
  const approveTxn = await escrowContract.connect(signer).approveTransaction(txnId);
  await approveTxn.wait();
}

export async function deny(escrowContract, signer, txnId) {
  const denyTxn = await escrowContract.connect(signer).denyTransaction(txnId);
  await denyTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [signer, setSigner] = useState();
  const escrowAddress = "0x8c98ab127eaD12B0624029Ba8c14B3fe8157a321"; 
  const escrowContract = new ethers.Contract(escrowAddress, abi, signer);
  
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner());
    }
  }, []);

  async function getLatestTransactionId() {
    const numberOfTransactions = await escrowContract.transactions.length();
    return numberOfTransactions - 1;
  }

  async function addTransaction() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('ether').value);
    const tx = await escrowContract.addTransaction(arbiter, beneficiary, { value: value });
    await tx.wait();

    const txnId = await getLatestTransactionId();
  
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('TransactionApproved', () => {
          document.getElementById(escrowContract.address).className = 'complete';
          document.getElementById(escrowContract.address).innerText = "✓ It's been approved!";
        });
        await approve(escrowContract, signer, txnId);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="transaction">
        <h1> New Transaction </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            addTransaction();
          }}
        >
          Deploy
        </div>
      </div>
      <div className="existing-transactions">
        <h1> Existing Transactions </h1>
        {escrows.map((escrow) => (
          <div key={escrow.address}>
            <h2>Contract at {escrow.address}</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Depositor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {escrow.transactions && escrow.transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.depositor}</td>
                    <td>{ethers.utils.formatEther(transaction.amount)} ETH</td>
                    <td>{transaction.approvalStatus}</td>
                    <td>
                      {transaction.approvalStatus === 'Pending' && (
                        <>
                          <button onClick={() => approve(escrowContract, signer, transaction.id)}>Approve</button>
                          <button onClick={() => deny(escrowContract, signer, transaction.id)}>Deny</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Escrow {...escrow} />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
