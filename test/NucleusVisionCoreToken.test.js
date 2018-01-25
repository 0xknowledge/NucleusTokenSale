const NucleusVisionCoreToken = artifacts.require("NucleusVisionCoreToken");

contract("NucleusVisionCoreToken", function(accounts) {
    beforeEach(async function() {
	this.token = await NucleusVisionCoreToken.new();
    });
  
    it("should have total supply of 10 nCore tokens", async function() {
	await this.token.mint(accounts);
	var totalSupply = await this.token.totalSupply();
	totalSupply.should.be.bignumber.equal(10, "total supply is not 10");
    });

    it ("cannot mint once finish mint is called", async function() {
	await this.token.mint([accounts[0]])
	const balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(1);

	await this.token.endMinting();
	await this.token.mint([accounts[1]]).should.be.rejectedWith('revert');	
    });
    
});					   
