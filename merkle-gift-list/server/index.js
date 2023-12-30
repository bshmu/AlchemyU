const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../../utils/MerkleTree');
const niceList = require('../../utils/niceList.json');
// const port = 5173;
// const app = express();
// app.use(express.json());
const app = express();
const cors = require("cors");
const port = 3042;
app.use(cors());
app.use(express.json());

// Hardcoded merkle root here representing the whole nice list
const MERKLE_ROOT = 'ddd59a2ffccddd60ff47993312821cd57cf30f7f14fb82937ebe2c4dc78375aa';

app.post("/gift", (req, res) => {

  const { name } = req.body;

  // Calculate the leaf and proof for the name
  const merkleTree = new MerkleTree(niceList);
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);

  // Verifying that the name is in the list
  const isInTheList = verifyProof(proof, name, MERKLE_ROOT);
  
  if(isInTheList) {
    res.send("You got a toy robot!");
  } else { 
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
