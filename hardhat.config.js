require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: './backend/.env' });

const RPC_URL = process.env.RPC_URL || '';
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  networks: {
    hardhat: {},
    sepolia: {
      url: RPC_URL,
      accounts: RELAYER_PRIVATE_KEY ? [RELAYER_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
