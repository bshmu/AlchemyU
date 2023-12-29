const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')

const privateKey = secp256k1.utils.randomPrivateKey()

console.log('private key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

console.log('public key:', toHex(publicKey));

function publicKeyToAddress(publicKey) {
    // Exclude the first byte (0x04) and convert to Buffer for hashing
    const publicKeyWithoutFirstByte = Buffer.from(publicKey.slice(2), 'hex');

    // Hash the public key using Keccak-256
    const hashedPublicKey = keccak256(publicKeyWithoutFirstByte);

    // Take the last 20 bytes (40 characters) of the hash to create the address
    const address = `0x${Buffer.from(hashedPublicKey).toString('hex').slice(-40)}`;

    return address;
}


const address = publicKeyToAddress(publicKey);

console.log('address:', address)