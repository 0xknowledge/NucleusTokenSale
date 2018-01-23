var Migrations = artifacts.require("./Migrations.sol");
var NucleusToken = artifacts.require("../contracts/NucleusToken.sol");
var NucleusAllocation = artifacts.require("../contracts/NucleusAllocation.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(NucleusToken);
};
