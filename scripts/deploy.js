const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying CertificateRegistry with account:', deployer.address);

  const Factory = await ethers.getContractFactory('CertificateRegistry');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('CertificateRegistry deployed to:', address);
  console.log('Add this to your backend/.env:');
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
