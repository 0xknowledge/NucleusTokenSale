const BigNumber = web3.BigNumber;

const NucleusToken = artifacts.require("NucleusToken");
const NucleusAllocation = artifacts.require("NucleusAllocation");
const TokenVesting = artifacts.require("TokenVesting");

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

function latestTime()  {
    return web3.eth.getBlock('latest').timestamp;
};

function advanceBlock () {
    return new Promise((resolve, reject) => {
	web3.currentProvider.sendAsync({
	    jsonrpc: '2.0',
	    method: 'evm_mine',
	    id: Date.now(),
	}, (err, res) => {
	    return err ? reject(err) : resolve(res);
	});
    });
};

function increaseTime (duration) {
    const id = Date.now();

    return new Promise((resolve, reject) => {
	web3.currentProvider.sendAsync({
	    jsonrpc: '2.0',
	    method: 'evm_increaseTime',
	    params: [duration],
	    id: id,
	}, err1 => {
	    if (err1) return reject(err1);

	    web3.currentProvider.sendAsync({
		jsonrpc: '2.0',
		method: 'evm_mine',
		id: id + 1,
	    }, (err2, res) => {
		return err2 ? reject(err2) : resolve(res);
	    });
	});
    });
};

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

// https://zeit.co/blog/async-and-await
function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("NucleusAllocation", function(accounts) {
    
    beforeEach(async function () {
	this.allocation = await NucleusAllocation.new();
	this.token = NucleusToken.at(await this.allocation.token());
    });

    it('should be token owner', async function() {
	const owner = await this.token.owner();
	owner.should.equal(this.allocation.address);
    });

    it('minted balance should reflect immediately', async function() {
	await this.allocation.mintTokens(accounts[0], 10);
	const balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(10);
    });
    
    it('airdrop balance should reflect immediately', async function() {
	await this.allocation.mintAirDropTokens(2, [accounts[0], accounts[1], accounts[2]]);
	for (var i = 0; i < 3; i++) {
	    const balance = await this.token.balanceOf(accounts[i]);
	    balance.should.be.bignumber.equal(2);
	}
    });
    
    it('vested balance should be reflected over time', async function() {
	const vestingStart = latestTime() + duration.minutes(1);
	const vestingCliff = duration.days(1);
	const vestingDuration = duration.days(4);
	
	await this.allocation.mintTokensWithTimeBasedVesting(accounts[0], 100, vestingStart, vestingCliff, vestingDuration)
	var vesting_contract = TokenVesting.at(await this.allocation.vesting(accounts[0]));
	var balance = 0;
	
	// without cliff being met no balance will be vested
	await vesting_contract.release(this.token.address).should.be.rejected;
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(0);

	await increaseTime(duration.days(1) + duration.minutes(1));
	await advanceBlock();

	// after cliff is met 1/4th will be vested
	await vesting_contract.release(this.token.address)	
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(25);

	// balance will not change until release is called
	await increaseTime(duration.days(1));
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(25);

	// after half of the duration half of the amount will be vested
	await vesting_contract.release(this.token.address)	
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(50);

	// vested balance can be transferred as the owner likes
	await this.token.transfer(accounts[1], 30, {from: accounts[0]})
	balance = await this.token.balanceOf(accounts[1]);
	balance.should.be.bignumber.equal(30);	
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(20);

	// once duration ends rest all should be vested
	await increaseTime(duration.days(3));
	await vesting_contract.release(this.token.address)	
	balance = await this.token.balanceOf(accounts[0]);
	balance.should.be.bignumber.equal(70);	
    });				
});
