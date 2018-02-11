pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title NucleusVisionCoreToken
 * @dev NucleusVisionCoreToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusVisionCoreToken is StandardToken, Ownable {
  string public constant name = 'NucleusVisionCore';
  string public constant symbol = 'nCore';
  uint8 public constant decimals = 0;
  bool public mintingFinished = false;

  event MintFinished();
  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev totalSupply is not set as we don't know how many investors will get the core token
   */
  function NucleusVisionCoreToken() public {
  }

  /**
   * @dev Function to mint tokens
   * @param recipients The list of addresses eligible to get a NucleusVisionCoreToken
   */
  function mint(address[] recipients) onlyOwner canMint public {
    uint newRecipients = 0;
    for( uint i = 0 ; i < recipients.length ; i++ ){
      address recipient = recipients[i];
      if(balances[recipient] == 0 ){
        Transfer( address(0x0), recipient, 1 );
        balances[recipient] = 1;
        newRecipients++;
      }
    }

    totalSupply = totalSupply.add(newRecipients);
  }

  /**
   * @dev Function to end minting process
   */
  function endMinting() onlyOwner canMint public {
    mintingFinished = true;
    MintFinished();
  }

  // nCore tokens are not transferrable
  function transfer(address _to, uint _value) returns (bool){ revert(); }
  function transferFrom(address _from, address _to, uint _value) returns (bool){ revert(); }
  function approve(address _spender, uint _value) returns (bool){ revert(); }
  function allowance(address _owner, address _spender) constant returns (uint){ return 0; }

}
