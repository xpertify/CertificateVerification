// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    address public admin;

    struct CertificateRecord {
        bytes32 dataHash;
        bytes32 institutionId;
        uint256 timestamp;
        bool revoked;
        bool exists;
    }

    mapping(bytes32 => bool) public authorizedInstitutions;
    mapping(bytes32 => CertificateRecord) private certificates;

    event InstitutionAuthorized(bytes32 institutionId);
    event InstitutionRevoked(bytes32 institutionId);
    event CertificateIssued(bytes32 certId, bytes32 institutionId, bytes32 dataHash, uint256 timestamp);
    event CertificateRevoked(bytes32 certId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: admin only");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addInstitution(bytes32 institutionId) external onlyAdmin {
        authorizedInstitutions[institutionId] = true;
        emit InstitutionAuthorized(institutionId);
    }

    function removeInstitution(bytes32 institutionId) external onlyAdmin {
        authorizedInstitutions[institutionId] = false;
        emit InstitutionRevoked(institutionId);
    }

    function issueCertificate(
        bytes32 certId,
        bytes32 institutionId,
        bytes32 dataHash
    ) external onlyAdmin {
        require(authorizedInstitutions[institutionId], "Institution not authorized");
        require(!certificates[certId].exists, "Certificate ID already exists");
        certificates[certId] = CertificateRecord({
            dataHash: dataHash,
            institutionId: institutionId,
            timestamp: block.timestamp,
            revoked: false,
            exists: true
        });
        emit CertificateIssued(certId, institutionId, dataHash, block.timestamp);
    }

    function revokeCertificate(bytes32 certId) external onlyAdmin {
        require(certificates[certId].exists, "Certificate does not exist");
        certificates[certId].revoked = true;
        emit CertificateRevoked(certId);
    }

    function getCertificate(bytes32 certId)
        external
        view
        returns (
            bytes32 dataHash,
            bytes32 institutionId,
            uint256 timestamp,
            bool revoked,
            bool exists
        )
    {
        CertificateRecord memory rec = certificates[certId];
        return (rec.dataHash, rec.institutionId, rec.timestamp, rec.revoked, rec.exists);
    }
}
