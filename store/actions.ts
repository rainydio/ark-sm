import BigNumber from "bignumber.js";
import { createAction } from "typesafe-actions";

export const setNonce = createAction(
	"NONCE_SET",
	(walletAddress: string, nonce: number) => {
		return { walletAddress, nonce };
	}
)();

export const incrementNonce = createAction(
	"NONCE_INCREMENT",
	(walletAddress: string) => {
		return { walletAddress };
	}
)();

export const setBalance = createAction(
	"BALANCE_SET",
	(walletAddress: string, balance: BigNumber) => {
		return { walletAddress, balance };
	}
)();

export const increaseBalance = createAction(
	"BALANCE_INCREASE",
	(walletAddress: string, amount: BigNumber) => {
		return { walletAddress, amount };
	}
)();

export const decreaseBalance = createAction(
	"BALANCE_DECREASE",
	(walletAddress: string, amount: BigNumber) => {
		return { walletAddress, amount };
	}
)();

export const setDelegate = createAction(
	"DELEGATE_SET",
	(walletAddress: string, delegateAddress: string) => {
		return { walletAddress, delegateAddress };
	}
)();

export const clearDelegate = createAction(
	"DELEGATE_CLEAR",
	(walletAddress: string) => {
		return { walletAddress };
	}
)();

export const increaseVoteBalance = createAction(
	"VOTE_BALANCE_INCREASE",
	(delegateAddress: string, amount: BigNumber) => {
		return { delegateAddress, amount };
	}
)();

export const decreaseVoteBalance = createAction(
	"VOTE_BALANCE_DECREASE",
	(delegateAddress: string, amount: BigNumber) => {
		return { delegateAddress, amount };
	}
)();

export const setVoteRank = createAction(
	"VOTE_RANK_SET",
	(delegateAddress: string, voteRank: number) => {
		return { delegateAddress, voteRank };
	}
)();

/// SAGA

export const setGenesisBalance = createAction(
	"GENESIS_BALANCE_SET",
	(walletAddress: string, balance: BigNumber) => {
		return { walletAddress, balance };
	}
)();

export const executeBalanceTransfer = createAction(
	"BALANCE_TRANSFER_EXECUTE",
	(
		walletAddress: string,
		walletNonce: number,
		destinationAddress: string,
		amount: BigNumber
	) => {
		return { walletAddress, walletNonce, destinationAddress, amount };
	}
)();

export const executeDelegateChoice = createAction(
	"DELEGATE_CHOICE_EXECUTE",
	(walletAddress: string, walletNonce: number, delegateAddress: string) => {
		return { walletAddress, walletNonce, delegateAddress };
	}
)();
