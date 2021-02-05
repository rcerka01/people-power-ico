// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './PeoplePowerToken.sol';

contract PeoplePowerTokenSale {

    address admin;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    PeoplePowerToken public tokenContract;

    constructor (PeoplePowerToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    event Sell(address _buyer, uint256 _amount);

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x  * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }
}
