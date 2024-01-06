// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    bool public isApproved = false;

    event Approved(uint);
	event DepositReceived(address sender, uint amount);

    constructor(address _arbiter, address payable _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
		emit DepositReceived(msg.sender, msg.value);
    }
    
    function approve() external payable {
        require(msg.sender == arbiter);
        require(isApproved == false, "Already approved");
        uint balance = address(this).balance;
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send Ether");
        isApproved = true;
        emit Approved(balance);
    }

	function deposit() external payable {
        require(isApproved == false, "Cannot deposit after approval");
        emit DepositReceived(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}