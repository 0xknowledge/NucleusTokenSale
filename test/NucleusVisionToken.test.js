const NucleusVisionToken = artifacts.require("NucleusVisionToken");

function Billion(x) {
  return x * 1000 * 1000 * 1000;
};

function DecimalsFormat(x) {
  // Nucleus token has  decimals
  return x * Math.pow(10, 18);
};

contract("NucleusVisionToken", function(accounts) {
  beforeEach(async function() {
    this.token = await NucleusVisionToken.new();
  });

  it("token metadata is correct", async function() {
    const name = await this.token.name();
    name.should.equal('NucleusVision');

    const symbol = await this.token.symbol();
    symbol.should.equal('nCash');

    const decimals = await this.token.decimals();
    assert.equal(decimals, 18);
  });

  it("should have the right owner", async function() {
    const owner = await this.token.owner();
    owner.should.equal(accounts[0]);
  });

  it("should have total supply of 10 billion nCash tokens", async function() {
    await this.token.mint(accounts[0], DecimalsFormat(Billion(10)));
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(10)), "total supply is not 10 billion");
  });

  it("should error if more than 10 billion nCash tokens are minted", async function() {
    // 6 billion
    await this.token.mint(accounts[0], DecimalsFormat(Billion(6)));
    // another 6 billion will error out
    await this.token.mint(accounts[0], DecimalsFormat(Billion(6))).should.be.rejectedWith('revert');

    // supply will still be 6 billion
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(6)), "total supply is not 6 billion");

    // another 4 billion should get through
    await this.token.mint(accounts[0], DecimalsFormat(Billion(4)));

    // supply should be 10 billion
    totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(10)), "total supply is not 10 billion");

    // no more tokens can be added
    await this.token.mint(accounts[0], 1).should.be.rejectedWith('revert');
    await this.token.mint(accounts[0], DecimalsFormat(1)).should.be.rejectedWith('revert');
    await this.token.mint(accounts[0], DecimalsFormat(Billion(1))).should.be.rejectedWith('revert');
  });

});
