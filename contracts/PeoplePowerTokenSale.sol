// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './PeoplePowerToken.sol';

contract PeoplePowerTokenSale {

    address admin;
    uint256 public tokenPrice;
    PeoplePowerToken public tokenContract;

    constructor (PeoplePowerToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}
