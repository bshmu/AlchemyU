const express = require("express");
const { keccak256 } = require('ethereum-cryptography/keccak');
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const app = express();
const cors = require("cors");
const port = 3042;
app.use(cors());
app.use(express.json());

const balances = {
  "0xd6a7d38872dca0f4509c353bb109251096088fad": 100,
  // Private Key: 8afa6d1584c55a1bb69b7e00c45b6acd9e95e654e8a28b3054db15f3c2bec37d
  "0x0dc3b97ae6ecccb5630e0ff0cd223eb5e3250864": 50,
  // Private Key: d7ee13744980901bfaa3eefaa919a58a5b47867110ae21a569e2b198750b6306
  "0x7df475bc537181f7fac8ee14a9564612e83dd40b": 150,
  // Private Key: a05b75c793aa7df5e8c4430e474331ab61f64aa7cbbee15c274406df0f2f1da3
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  
  const { sender, recipient, amount, privateKey } = req.body;

  // Check that the private key is valid length:
  if (privateKey.length != 64) {
    return res.status(400).send({ error: "Invalid private key length" });
  }

  // Reconstruct the message from the transaction details
  const message = `Transfer ${amount} to ${recipient}`;
  const messageHash = keccak256(Buffer.from(message, 'utf-8'));

  // Recover the public key from the signature
  const privateKeyArray = Buffer.from(privateKey, 'hex');
  const publicKey = secp256k1.getPublicKey(privateKeyArray);
  const signature = secp256k1.sign(messageHash, privateKeyArray);
  const isSigned = secp256k1.verify(signature, messageHash, publicKey);

  // Check that the message is signed correctly
  if (!isSigned) {
    return res.status(400).send({ error: "Invalid signature" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Check that the sender has enough funds to cover the transfer
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}