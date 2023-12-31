import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [address, setAddress] = useState('');
  const [blocksToSearch, setBlocksToSearch] = useState('');
  const [txnHistory, setTxnHistory] = useState([]);

  const handleSearch = async () => {
    const newTxnHistory = [];
    const blockNumber = await alchemy.core.getBlockNumber();
    for (let i = blockNumber - parseInt(blocksToSearch); i <= blockNumber; i++) {
      const block = await alchemy.core.getBlockWithTransactions(i);
      const blockTransactions = block.transactions;
      const dateObj = new Date(block.timestamp * 1000);
      const date = dateObj.toLocaleString();

      blockTransactions.forEach(tx => {
        if (tx.from === address || tx.to === address) {
          const gasFee = tx.gasPrice.mul(tx.gasLimit);
          const txnRecord = {
            Date: date,
            'Block Number': i.toString(),
            'Txn Type': tx.from === address ? 'Sent' : 'Received',
            'Counterparty': tx.from === address ? tx.to : tx.from,
            'Amount': ethers.formatEther(tx.value._hex),
            'Gas Fee': ethers.formatEther(gasFee._hex),
            'Etherscan Txn Record': `https://etherscan.io/tx/${tx.hash}`
          };
          newTxnHistory.push(txnRecord);
        }
      });
    }
    // console.log(newTxnHistory[0]);
    setTxnHistory(newTxnHistory);
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Blocks to Search"
        value={blocksToSearch}
        onChange={e => setBlocksToSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {txnHistory.length > 0 && (
        <table className='table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Block Number</th>
              <th>Txn Type</th>
              <th>Counterparty</th>
              <th>Amount (ETH)</th>
              <th>Gas Fee (ETH)</th>
              <th>Etherscan Txn Record</th>
            </tr>
          </thead>
          <tbody>
            {txnHistory.map((txn, index) => (
              <tr key={index}>
                <td>{txn.Date}</td>
                <td>{txn['Block Number']}</td>
                <td>{txn['Txn Type']}</td>
                <td>{txn['Counterparty']}</td>
                <td>{txn['Amount']}</td>
                <td>{txn['Gas Fee']}</td>
                <td><a href={txn['Etherscan Txn Record']} target="_blank" rel="noreferrer">{txn['Etherscan Txn Record']}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

// 0xEb457B9882c30619034f3cFefF660a8b025864Ac