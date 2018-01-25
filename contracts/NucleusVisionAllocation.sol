pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/TokenVesting.sol";
import './NucleusToken.sol';

/**
 * @title NucleusAllocation
 * @dev NucleusAllocation is the contract that creates NucleusToken and
 * provides interface for the owner to mint tokens to appropriate share holders.
 */
contract NucleusAllocation is Ownable {
  using SafeMath for uint256;

  // The token being minted.
  NucleusToken public token;

  // map of address to token vesting contract
  mapping (address => TokenVesting) public vesting;

  /**
   * event for token mint logging
   * @param beneficiary who is receiving the tokens
   * @param tokens amount of tokens given to the beneficiary
   */
  event NucleusTokensMinted(address beneficiary, uint256 tokens);

  /**
   * event for time vested token mint logging
   * @param beneficiary who is receiving the time vested tokens
   * @param tokens amount of tokens that will be vested to the beneficiary
   * @param start unix timestamp at which the tokens will start vesting
   * @param cliff duration in seconds after start time at which vesting will start
   * @param duration total duration in seconds in which the tokens will be vested
   */
  event NucleusTimeVestingTokensMinted(address beneficiary, uint256 tokens, uint256 start, uint256 cliff, uint256 duration);

  /**
   * event for air drop token mint loggin
   * @param beneficiary who is receiving the airdrop tokens
   * @param tokens airdropped
   */
  event NucleusAirDropTokensMinted(address beneficiary, uint256 tokens);

  /**
   * @dev Creates a new NucleusAllocation contract
   */
  function NucleusAllocation() public {
    token = new NucleusToken();
  }

  // member function to mint tokens to a beneficiary
  function mintTokens(address beneficiary, uint256 tokens) public onlyOwner {
    require(beneficiary != 0x0);
    require(tokens > 0);

    token.mint(beneficiary, tokens);
    NucleusTokensMinted(beneficiary, tokens);
  }

  // member function to mint time based vesting tokens to a beneficiary
  function mintTokensWithTimeBasedVesting(address beneficiary, uint256 tokens, uint256 start, uint256 cliff, uint256 duration) public onlyOwner {
    require(beneficiary != 0x0);
    require(tokens > 0);
    
    vesting[beneficiary] = new TokenVesting(beneficiary, start, cliff, duration, false);
    token.mint(address(vesting[beneficiary]), tokens);
    
    NucleusTimeVestingTokensMinted(beneficiary, tokens, start, cliff, duration);
  }

  function mintAirDropTokens(uint256 tokens, address[] addresses) public onlyOwner {
    require(tokens > 0);
    for (uint256 i = 0; i < addresses.length; i++) {
      token.mint(addresses[i], tokens);
      NucleusAirDropTokensMinted(addresses[i], tokens);
    }
  }

  // member function to finish the minting process
  function finishAllocation() public onlyOwner {
    token.finishMinting();
  }

  // member function that can be called to release vested tokens periodically
  function releaseVestedTokens(address beneficiary) public {
    require(beneficiary != 0x0);
    
    TokenVesting tokenVesting = vesting[beneficiary];
    tokenVesting.release(token);
  }
    
}
