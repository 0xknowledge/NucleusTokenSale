const BigNumber = web3.BigNumber;

const NucleusVisionToken = artifacts.require("NucleusVisionToken");
const NucleusVisionAirDrop = artifacts.require("NucleusVisionAirDrop");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract("NucleusVisionAirDrop", function(accounts) {

  beforeEach(async function () {
    this.token = await NucleusVisionToken.new();
    this.airdrop = await NucleusVisionAirDrop.new();
    this.token.mint(this.airdrop.address, 100);
    await this.token.unlockToken();
  });

  it('batch airdrop fails with less balance', async function() {
    await this.airdrop.batchAirDrop(this.token.address, accounts, 20).should.be.rejectedWith('revert');
  });

  it('batch airdrop should work', async function() {
    var balance;
    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(100);

    await this.airdrop.batchAirDrop(this.token.address, accounts, 10);

    for (let i = 0; i < 10; i++) {
      balance = await this.token.balanceOf(accounts[i]);
      balance.should.be.bignumber.equal(10);
    }

    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(0);
  });

  it('multibatch airdrop should work', async function() {
    var balance;
    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(100);

    await this.airdrop.batchAirDrop(this.token.address, [accounts[0], accounts[1], accounts[2]], 10);
    await this.airdrop.batchAirDrop(this.token.address, [accounts[3], accounts[4], accounts[5]], 10);
    await this.airdrop.batchAirDrop(this.token.address, [accounts[6], accounts[7], accounts[8]], 10);
    await this.airdrop.batchAirDrop(this.token.address, [accounts[9]], 10);

    for (let i = 0; i < 10; i++) {
      balance = await this.token.balanceOf(accounts[i]);
      balance.should.be.bignumber.equal(10);
    }

    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(0);
  });

  it('balance get reflected inbetween', async function() {
    var balance;
    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(100);

    await this.airdrop.batchAirDrop(this.token.address, [accounts[0], accounts[1], accounts[2]], 10);

    for (let i = 0; i < 10; i++) {
      balance = await this.token.balanceOf(accounts[i]);
      if (i < 3) {
        balance.should.be.bignumber.equal(10);
      } else {
        balance.should.be.bignumber.equal(0);
      }
    }

    balance = await this.token.balanceOf(this.airdrop.address);
    balance.should.be.bignumber.equal(70);

    await this.airdrop.revokeBalance(this.token.address, accounts[5]);
    balance = await this.token.balanceOf(accounts[5]);
    balance.should.be.bignumber.equal(70);
  });

});
