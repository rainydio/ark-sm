import { takeEvery, select, put, fork } from "redux-saga/effects";
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

export function* followDelegateChangesSaga() {
	// after every `setDelegate`
	yield takeEvery(setDelegate, function*({ payload }) {
		if (yield select(hasPositiveBalance, payload.walletAddress)) {
			// increase new delegate's vote balance
			const balance = yield select(getBalance, payload.walletAddress);
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(increaseVoteBalance(delegateAddress, balance));

			if (yield select(hasPrevDelegate, payload.walletAddress)) {
				// and decrease previous delegate's vote balance
				const prevDelegateAddress = yield select(
					getPrevDelegate,
					payload.walletAddress
				);
				yield put(decreaseVoteBalance(prevDelegateAddress, balance));
			}
		}
	});

	// after every `clearDelegate`
	yield takeEvery(clearDelegate, function*({ payload }) {
		if (yield select(hasPositiveBalance, payload.walletAddress)) {
			if (yield select(hasPrevDelegate, payload.walletAddress)) {
				// decrease previous delegate's vote balance
				const balance = yield select(getBalance, payload.walletAddress);
				const prevDelegateAddress = yield select(
					getPrevDelegate,
					payload.walletAddress
				);
				yield put(decreaseVoteBalance(prevDelegateAddress, balance));
			}
		}
	});
}

export default function* updateVoteBalanceSaga() {
	yield fork(followBalanceChangesSaga);
	yield fork(followDelegateChangesSaga);
}
