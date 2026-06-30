require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'RPC_URL',
  'RELAYER_PRIVATE_KEY',
  'CONTRACT_ADDRESS',
  'CHAIN_ID',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RPC_URL: process.env.RPC_URL,
  RELAYER_PRIVATE_KEY: process.env.RELAYER_PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  CHAIN_ID: parseInt(process.env.CHAIN_ID, 10),
};
