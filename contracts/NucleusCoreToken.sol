pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";

/**
 * @title NucleusCoreToken
 * @dev NucleusCoreToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusCoreToken is MintableToken, Pausable {
  string public constant name = 'NucleusCore';
  string public constant symbol = 'nCore';
  uint8 public constant decimals = 0;

  /**
   * @dev totalSupply is not set as we don't know how many investors will get the core token
   */
  function NucleusCoreToken() public {
  }

  // nCore tokens are not transferrable
  function transfer(address _to, uint _value) returns (bool){ revert(); }
  function transferFrom(address _from, address _to, uint _value) returns (bool){ revert(); }
  function approve(address _spender, uint _value) returns (bool){ revert(); }
  function allowance(address _owner, address _spender) constant returns (uint){ return 0; }
}
