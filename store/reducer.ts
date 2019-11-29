import R from "ramda";
import BigNumber from "bignumber.js";
import { combineReducers } from "redux";
import { getType, ActionType } from "typesafe-actions";
import {
	setNonce,
	incrementNonce,
	setBalance,
	increaseBalance,
	decreaseBalance,
	setDelegate,
	clearDelegate,
	increaseVoteBalance,
	decreaseVoteBalance,
	setVoteRank
} from "./actions";

type NoncesState = Record<string, number>;
type NoncesActionType =
	| ActionType<typeof setNonce>
	| ActionType<typeof incrementNonce>;

const nonces = (state: NoncesState = {}, action: NoncesActionType) => {
	switch (action.type) {
		case getType(setNonce):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: action.payload.nonce
			});
		case getType(incrementNonce):
			return Object.assign({}, state, {
				[action.payload.walletAddress]:
					1 + (state[action.payload.walletAddress] || 1)
			});
		default:
			return state;
	}
};

type BalancesState = Record<string, BigNumber>;
type BalancesActionType =
	| ActionType<typeof setBalance>
	| ActionType<typeof increaseBalance>
	| ActionType<typeof decreaseBalance>;

const balances = (state: BalancesState = {}, action: BalancesActionType) => {
	switch (action.type) {
		case getType(setBalance):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: action.payload.balance
			});
		case getType(increaseBalance):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: new BigNumber(
					state[action.payload.walletAddress] || 0
				).plus(action.payload.amount)
			});
		case getType(decreaseBalance):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: new BigNumber(
					state[action.payload.walletAddress] || 0
				).minus(action.payload.amount)
			});
		default:
			return state;
	}
};

type DelegatesState = Record<string, { curr: string; prev: string }>;
type DelegatesActionType =
	| ActionType<typeof setDelegate>
	| ActionType<typeof clearDelegate>;

const delegates = (state: DelegatesState = {}, action: DelegatesActionType) => {
	switch (action.type) {
		case getType(setDelegate):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: {
					curr: action.payload.delegateAddress,
					prev: R.path([action.payload.walletAddress, "curr"], state)
				}
			});
		case getType(clearDelegate):
			return Object.assign({}, state, {
				[action.payload.walletAddress]: {
					curr: null,
					prev: R.path([action.payload.walletAddress, "curr"], state)
				}
			});
		default:
			return state;
	}
};

type VoteBalancesState = Record<string, BigNumber>;
type VoteBalancesActionType =
	| ActionType<typeof increaseVoteBalance>
	| ActionType<typeof decreaseVoteBalance>;

const voteBalances = (
	state: VoteBalancesState = {},
	action: VoteBalancesActionType
) => {
	switch (action.type) {
		case getType(increaseVoteBalance):
			return Object.assign({}, state, {
				[action.payload.delegateAddress]: new BigNumber(
					state[action.payload.delegateAddress] || 0
				).plus(action.payload.amount)
			});
		case getType(decreaseVoteBalance):
			return Object.assign({}, state, {
				[action.payload.delegateAddress]: new BigNumber(
					state[action.payload.delegateAddress] || 0
				).minus(action.payload.amount)
			});
		default:
			return state;
	}
};

type VoteRanksState = Array<string>;
type VoteRanksActionType = ActionType<typeof setVoteRank>;

const voteRanks = (state: VoteRanksState = [], action: VoteRanksActionType) => {
	switch (action.type) {
		case getType(setVoteRank):
			return R.insert(
				action.payload.voteRank,
				action.payload.delegateAddress,
				R.without([action.payload.delegateAddress], state)
			);
		default:
			return state;
	}
};

const reducer = combineReducers({
	nonces,
	balances,
	delegates,
	voteBalances,
	voteRanks
});

export type State = ReturnType<typeof reducer>;
export default reducer;
