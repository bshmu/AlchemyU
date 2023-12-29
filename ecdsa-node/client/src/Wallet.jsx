import React, { useState } from 'react';
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1"
import { toHex } from 'ethereum-cryptography/utils'

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  const [inputValue, setInputValue] = useState('');

  async function onChange(evt) {
    const input = evt.target.value;
    setInputValue(input); // Update the inputValue state
    
    // Check if the input is meant to be a private key or an address
    if (input.length === 64) { // Length of a private key in hex
      try {
        // Process as a private key
        setPrivateKey(input);
        const privateKeyArray = Buffer.from(privateKey, 'hex');
        const publicKey = secp256k1.getPublicKey(privateKeyArray);
        const derivedAddress = toHex(pußblicKey);
        setAddress(derivedAddress);
        fetchBalance(derivedAddress);
      } catch (error) {
        console.error("Error processing private key: ", error.message);
      }
    } else if (input.length === 40 || input.length === 42) { // Length of an Ethereum address in hex (with or without '0x')
      // Process as an address
      setAddress(input);
      fetchBalance(input);
    } else {
      // Reset the balance and private key if the input is invalid or incomplete
      setBalance(0);
      setPrivateKey('');
    }
  }

  async function fetchBalance(addr) {
    if (addr) {
      try {
        const { data: { balance } } = await server.get(`balance/${addr}`);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching balance: ", error.message);
        setBalance(0);
      }
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address
        <input placeholder="Type in an address" value={inputValue} onChange={onChange}></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
