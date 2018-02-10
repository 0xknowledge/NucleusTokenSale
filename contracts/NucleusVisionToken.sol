pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title NucleusVisionToken
 * @dev NucleusVisionToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusVisionToken is MintableToken, Pausable {
  string public constant name = 'NucleusVision';
  string public constant symbol = 'nCash';
  uint8 public constant decimals = 18;

  // Total supply of nCash tokens is 10 Billion
  uint256 public constant TOTAL_SUPPLY = 10 * 1000 * 1000 * 1000 * (10 ** uint256(decimals));

  /**
   * @dev totalSupply is set via the minting process
   */
  function NucleusVisionToken() public {
  }

  function mint(address to, uint256 amount) onlyOwner public returns (bool) {
    require(totalSupply + amount <= TOTAL_SUPPLY);
    super.mint(to, amount);
  }

}
