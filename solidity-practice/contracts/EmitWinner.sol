// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface WinnerContract {
    function attempt() external;
}

contract EmitWinner {
    function sendAttempt(address _contract) public {
        return WinnerContract(_contract).attempt();
    }
}