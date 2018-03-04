pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './NucleusVisionToken.sol';

contract NucleusVisionAirDrop is Ownable {

  function NucleusVisionAirDrop() public {
  }

  function batchAirDrop(address token_address, address[] recipients, uint256 ncash) onlyOwner public {
    NucleusVisionToken token = NucleusVisionToken(token_address);
    for(uint i = 0 ; i < recipients.length ; i++) {
      address recipient = recipients[i];
      require(token.transfer(recipient, ncash));
    }
  }

}
