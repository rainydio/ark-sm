import { takeEvery, select, put, fork, call } from "redux-saga/effects";
import {
	hasDelegate,
	getDelegate,
	hasPrevDelegate,
	getBalance,
	getPrevDelegate,
	hasPositiveBalance
} from "../store/selectors";
import {
	increaseBalance,
	increaseVoteBalance,
	decreaseBalance,
	decreaseVoteBalance,
	setDelegate,
	clearDelegate
} from "../store/actions";

export function* giveDelegateVoteBalance(walletAddress: string) {
	if (yield select(hasPositiveBalance, walletAddress)) {
		if (yield select(hasDelegate, walletAddress)) {
			const balance = yield select(getBalance, walletAddress);
			const delegateAddress = yield select(getDelegate, walletAddress);
			yield put(increaseVoteBalance(delegateAddress, balance));
		}
	}
}

export function* takePreviousDelegateVoteBalance(walletAddress: string) {
	if (yield select(hasPositiveBalance, walletAddress)) {
		if (yield select(hasPrevDelegate, walletAddress)) {
			const balance = yield select(getBalance, walletAddress);
			const prevDelegateAddress = yield select(getPrevDelegate, walletAddress);
			yield put(decreaseVoteBalance(prevDelegateAddress, balance));
		}
	}
}

export function* followDelegateChangesSaga() {
	// after every `setDelegate`
	yield takeEvery(setDelegate, function*({ payload }) {
		yield call(takePreviousDelegateVoteBalance, payload.walletAddress);
		yield call(giveDelegateVoteBalance, payload.walletAddress);
	});

	// after every `clearDelegate`
	yield takeEvery(clearDelegate, function*({ payload }) {
		yield call(takePreviousDelegateVoteBalance, payload.walletAddress);
	});
}

export function* followBalanceChangesSaga() {
	// after every `increaseBalance`
	yield takeEvery(increaseBalance, function*({ payload }) {
		if (yield select(hasDelegate, payload.walletAddress)) {
			// also increase delegate's vote balance
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(increaseVoteBalance(delegateAddress, payload.amount));
		}
	});

	// after every `decreaseBalance`
	yield takeEvery(decreaseBalance, function*({ payload }) {
		if (yield select(hasDelegate, payload.walletAddress)) {
			// also decrease delegate's vote balance
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(decreaseVoteBalance(delegateAddress, payload.amount));
		}
	});
}

export default function* updateVoteBalanceSaga() {
	yield fork(followDelegateChangesSaga);
	yield fork(followBalanceChangesSaga);
}
