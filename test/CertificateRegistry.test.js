const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CertificateRegistry', function () {
  let registry;
  let admin;
  let nonAdmin;

  const institutionId = ethers.keccak256(ethers.toUtf8Bytes('inst-uuid-001'));
  const certId = ethers.keccak256(ethers.toUtf8Bytes('cert-uuid-001'));
  const dataHash = ethers.keccak256(ethers.toUtf8Bytes('{"studentName":"Alice"}'));

  beforeEach(async function () {
    [admin, nonAdmin] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('CertificateRegistry');
    registry = await Factory.deploy();
  });

  it('deploys with admin set to deployer', async function () {
    expect(await registry.admin()).to.equal(admin.address);
  });

  it('non-admin cannot call addInstitution', async function () {
    await expect(
      registry.connect(nonAdmin).addInstitution(institutionId)
    ).to.be.revertedWith('Not authorized: admin only');
  });

  it('admin can addInstitution and emits InstitutionAuthorized', async function () {
    await expect(registry.addInstitution(institutionId))
      .to.emit(registry, 'InstitutionAuthorized')
      .withArgs(institutionId);
    expect(await registry.authorizedInstitutions(institutionId)).to.be.true;
  });

  it('issueCertificate reverts for unauthorized institution', async function () {
    await expect(
      registry.issueCertificate(certId, institutionId, dataHash)
    ).to.be.revertedWith('Institution not authorized');
  });

  it('issueCertificate succeeds for authorized institution and emits CertificateIssued', async function () {
    await registry.addInstitution(institutionId);
    await expect(registry.issueCertificate(certId, institutionId, dataHash))
      .to.emit(registry, 'CertificateIssued')
      .withArgs(certId, institutionId, dataHash, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
  });

  it('issueCertificate reverts for duplicate certId', async function () {
    await registry.addInstitution(institutionId);
    await registry.issueCertificate(certId, institutionId, dataHash);
    await expect(
      registry.issueCertificate(certId, institutionId, dataHash)
    ).to.be.revertedWith('Certificate ID already exists');
  });

  it('getCertificate on nonexistent certId returns exists = false', async function () {
    const result = await registry.getCertificate(certId);
    expect(result.exists).to.be.false;
  });

  it('getCertificate returns correct dataHash and institutionId after issuance', async function () {
    await registry.addInstitution(institutionId);
    await registry.issueCertificate(certId, institutionId, dataHash);
    const result = await registry.getCertificate(certId);
    expect(result.dataHash).to.equal(dataHash);
    expect(result.institutionId).to.equal(institutionId);
    expect(result.exists).to.be.true;
    expect(result.revoked).to.be.false;
  });

  it('revokeCertificate sets revoked = true and emits CertificateRevoked', async function () {
    await registry.addInstitution(institutionId);
    await registry.issueCertificate(certId, institutionId, dataHash);
    await expect(registry.revokeCertificate(certId))
      .to.emit(registry, 'CertificateRevoked')
      .withArgs(certId);
    const result = await registry.getCertificate(certId);
    expect(result.revoked).to.be.true;
  });

  it('revokeCertificate reverts for nonexistent certId', async function () {
    await expect(
      registry.revokeCertificate(certId)
    ).to.be.revertedWith('Certificate does not exist');
  });
});
