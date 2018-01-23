const NucleusCoreToken = artifacts.require("NucleusCoreToken");

contract("NucleusCoreToken", function(accounts) {
  beforeEach(async function() {
    this.token = await NucleusCoreToken.new();
  });
  
  it("should have total supply of 10 nCore tokens", async function() {
    for (let i = 0; i < 10; ++i) {
      await this.token.mint(accounts[i], 1);
    }
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(10, "total supply is not 10");
  });
});					   
