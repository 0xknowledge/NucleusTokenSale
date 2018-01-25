var Migrations = artifacts.require("./Migrations.sol");
var NucleusVisionToken = artifacts.require("../contracts/NucleusVisionToken.sol");
var NucleusVisionAllocation = artifacts.require("../contracts/NucleusVisionAllocation.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(NucleusVisionToken);
};
