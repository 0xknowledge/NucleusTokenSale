const NucleusToken = artifacts.require("NucleusToken");

contract("NucleusToken", function(accounts) {
  beforeEach(async function() {
    this.token = await NucleusToken.new();
  });
  
  it("should have total supply of 10 billion nCash tokens", async function() {
    await this.token.mint(accounts[0], 10 * 1000 * 1000 * 1000 * (Math.pow(10, 18)));
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(10 * 1000 * 1000 * 1000 * (Math.pow(10, 18)), "total supply is not 10 billion");
  });
});					   
