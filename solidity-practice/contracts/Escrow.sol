// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {

	enum ApprovalStatus { Approved, Denied, Pending }

	struct Transaction {
		uint256 id;
		address depositor;
		address arbiter;
		address beneficiary;
		uint256 amount;
		uint256 timestamp;
		ApprovalStatus approvalStatus;
	}	

	Transaction[] public transactions;
	event TransactionApproved(uint256);

	function addTransaction(address _arbiter, address _beneficiary) external payable {
		require(msg.value > 0);
		transactions.push(Transaction(
			transactions.length + 1,
			msg.sender,
			_arbiter,
			_beneficiary,
			msg.value,
			block.timestamp,
			ApprovalStatus.Pending));		
	}

	function getListTransactions() public view returns(Transaction[] memory) {
		uint j = 0;
		Transaction[] memory filteredTransactions;
		for (uint i = 0; i < transactions.length; i++) {
			if (transactions[i].depositor == msg.sender) {
				filteredTransactions[j] = transactions[i];
				j++;
			}
		}
		return filteredTransactions;
	}

	function approveTransaction(uint256 txnId) external payable {
		require(txnId < transactions.length, "Invalid transaction ID");
		Transaction storage _transaction = transactions[txnId];
		
		require(msg.sender == _transaction.arbiter);
		require(_transaction.approvalStatus != ApprovalStatus.Denied, "Transaction was denied");
		(bool sent, ) = payable(_transaction.beneficiary).call{value: _transaction.amount}("");
		require(sent, "Failed to send Ether");
		
		_transaction.approvalStatus = ApprovalStatus.Approved;
		emit TransactionApproved(_transaction.amount);
	}

	function denyTransaction(uint256 txnId) external payable {
		require(txnId < transactions.length, "Invalid transaction ID");
		Transaction storage _transaction = transactions[txnId];
		
		require(msg.sender == _transaction.arbiter);
		_transaction.approvalStatus = ApprovalStatus.Denied;
	}
	
}
