const { Web3 } = require('web3');
const { RPC_URL, RELAYER_PRIVATE_KEY, CONTRACT_ADDRESS, CHAIN_ID } = require('../config/env');

const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"certId","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"institutionId","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"CertificateIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"certId","type":"bytes32"}],"name":"CertificateRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"institutionId","type":"bytes32"}],"name":"InstitutionAuthorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"institutionId","type":"bytes32"}],"name":"InstitutionRevoked","type":"event"},{"inputs":[{"internalType":"bytes32","name":"institutionId","type":"bytes32"}],"name":"addInstitution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"authorizedInstitutions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"certId","type":"bytes32"}],"name":"getCertificate","outputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes32","name":"institutionId","type":"bytes32"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"certId","type":"bytes32"},{"internalType":"bytes32","name":"institutionId","type":"bytes32"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"issueCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"institutionId","type":"bytes32"}],"name":"removeInstitution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"certId","type":"bytes32"}],"name":"revokeCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const web3 = new Web3(RPC_URL);

const account = web3.eth.accounts.privateKeyToAccount(RELAYER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

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
