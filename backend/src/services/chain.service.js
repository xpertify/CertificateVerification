const { Web3 } = require('web3');
const path = require('path');
const { RPC_URL, RELAYER_PRIVATE_KEY, CONTRACT_ADDRESS, CHAIN_ID } = require('../config/env');

// ABI loaded from Hardhat compiled artifact — run `npx hardhat compile` first
const artifact = require(path.join(
  __dirname,
  '../../../../artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json'
));

const web3 = new Web3(RPC_URL);

const account = web3.eth.accounts.privateKeyToAccount(RELAYER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contract = new web3.eth.Contract(artifact.abi, CONTRACT_ADDRESS);

function toBytes32(uuid) {
  return web3.utils.keccak256(uuid);
}

function hashToBytes32(hexHash) {
  return '0x' + hexHash;
}

async function sendTx(method) {
  const gas = await method.estimateGas({ from: account.address });
  const receipt = await method.send({
    from: account.address,
    gas: Math.ceil(Number(gas) * 1.2),
    chainId: CHAIN_ID,
  });
  return receipt;
}

async function addInstitution(institutionId) {
  const institutionIdBytes32 = toBytes32(institutionId);
  const receipt = await sendTx(
    contract.methods.addInstitution(institutionIdBytes32)
  );
  return receipt.transactionHash;
}

async function issueCertificate(certId, institutionId, dataHash) {
  const certIdBytes32 = toBytes32(certId);
  const institutionIdBytes32 = toBytes32(institutionId);
  const dataHashBytes32 = hashToBytes32(dataHash);
  const receipt = await sendTx(
    contract.methods.issueCertificate(certIdBytes32, institutionIdBytes32, dataHashBytes32)
  );
  return receipt.transactionHash;
}

async function revokeCertificate(certId) {
  const certIdBytes32 = toBytes32(certId);
  const receipt = await sendTx(
    contract.methods.revokeCertificate(certIdBytes32)
  );
  return receipt.transactionHash;
}

async function getCertificate(certId) {
  const certIdBytes32 = toBytes32(certId);
  const result = await contract.methods.getCertificate(certIdBytes32).call();
  return {
    dataHash: result.dataHash,
    institutionId: result.institutionId,
    timestamp: result.timestamp,
    revoked: result.revoked,
    exists: result.exists,
  };
}

module.exports = { addInstitution, issueCertificate, revokeCertificate, getCertificate };
