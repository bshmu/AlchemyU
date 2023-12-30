const axios = require('axios');
const niceList = require('../../utils/niceList.json');
const MerkleTree = require('../../utils/MerkleTree');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { bytesToHex } = require('ethereum-cryptography/utils');

const serverUrl = 'http://localhost:1225';

async function main() {
  // The name we want to prove is in the nice list
  const name = 'Olive Kong'; // Replace with actual name

  // Calculate the leaf and proof for the name
  const merkleTree = new MerkleTree(niceList);
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);

  // console.log({ name, proof });

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof,
    name
  });

  console.log({ gift });
}

main();