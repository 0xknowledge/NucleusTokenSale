const NucleusCoreToken = artifacts.require("NucleusCoreToken");

contract("NucleusCoreToken", function(accounts) {
    beforeEach(async function() {
	this.token = await NucleusCoreToken.new();
    });
  
    it("should have total supply of 10 nCore tokens", async function() {
	await this.token.mint(accounts);
	var totalSupply = await this.token.totalSupply();
	totalSupply.should.be.bignumber.equal(10, "total supply is not 10");
    });
    
});					   
