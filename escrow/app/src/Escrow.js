import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  escrowContract,
  lastDeposit
}) {
  const [balance, setBalance] = useState("0");

  const fetchBalance = async () => {
    if (!escrowContract) {
      console.error("Contract instance not available");
      return;
    }
    const balanceInWei = await escrowContract.getBalance();
    setBalance(ethers.utils.formatEther(balanceInWei));
  };

  useEffect(() => {
    fetchBalance();
  }, [address, lastDeposit]); // Re-fetch balance when lastDeposit updates

  const valueInEther = ethers.utils.formatEther(value);

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {valueInEther} ETH </div>
        </li>
        <li>
          <div> Current Balance </div>
          <div> {balance} ETH </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
