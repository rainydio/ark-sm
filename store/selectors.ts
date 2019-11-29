import BigNumber from "bignumber.js";
import { State } from "./reducer";

export const getNonce = (state: State, walletAddress: string) => {
	return state.nonces[walletAddress] || 1;
};

export const getBalance = (state: State, walletAddress: string) => {
	return state.balances[walletAddress] || new BigNumber(0);
};

export const hasPositiveBalance = (state: State, walletAddress: string) => {
	return getBalance(state, walletAddress).isGreaterThan(0);
};

export const getDelegates = (state: State) => {
	return Object.keys(state.delegates);
};

export const hasDelegate = (state: State, walletAddress: string) => {
	return state.delegates[walletAddress] && state.delegates[walletAddress].curr;
};

export const getDelegate = (state: State, walletAddress: string) => {
	return state.delegates[walletAddress].curr;
};

export const hasPrevDelegate = (state: State, walletAddress: string) => {
	return state.delegates[walletAddress] && state.delegates[walletAddress].prev;
};

export const getPrevDelegate = (state: State, walletAddress: string) => {
	return state.delegates[walletAddress].prev;
};

export const getVoteBalance = (state: State, delegateAddress: string) => {
	return state.voteBalances[delegateAddress] || new BigNumber(0);
};

export const getVoteRanks = (state: State) => {
	return state.voteRanks;
};

export const getVoteRanksTop = (state: State, count: number) => {
	return getVoteRanks(state).slice(0, count);
};

export const getVoteRank = (state: State, delegateAddress: string) => {
	return state.voteRanks.indexOf(delegateAddress);
};

export const getNewHigherVoteRank = (state: State, delegateAddress: string) => {
	if (state.voteRanks.length === 0) {
		return 0;
	}

	const voteBalance = getVoteBalance(state, delegateAddress);
	const voteRank = getVoteRank(state, delegateAddress);
	const startFrom = voteRank === -1 ? state.voteRanks.length - 1 : voteRank - 1;

	for (let i = startFrom; i >= 0; i--) {
		const delegateAddressI = state.voteRanks[i];
		const voteBalanceI = getVoteBalance(state, delegateAddressI);
		if (voteBalanceI.isGreaterThanOrEqualTo(voteBalance)) {
			return i + 1;
		}
	}

	return 0;
};

export const getNewLowerVoteRank = (state: State, delegateAddress: string) => {
	if (state.voteRanks.length === 0) {
		return 0;
	}

	const voteBalance = getVoteBalance(state, delegateAddress);
	const voteRank = getVoteRank(state, delegateAddress);
	const startFrom = voteRank === -1 ? 0 : voteRank + 1;

	for (let i = startFrom; i < state.voteRanks.length; i++) {
		const delegateAddressI = state.voteRanks[i];
		const voteBalanceI = getVoteBalance(state, delegateAddressI);
		if (voteBalanceI.isLessThanOrEqualTo(voteBalance)) {
			return voteRank === -1 ? i : i - 1;
		}
	}

	if (voteRank === -1) {
		return state.voteRanks.length;
	} else {
		return state.voteRanks.length - 1;
	}
};
