import { takeEvery, select, put } from "redux-saga/effects";
import {
	hasDelegate,
	getDelegate,
	hasPrevDelegate,
	getBalance,
	getPrevDelegate
} from "../store/selectors";
import {
	increaseBalance,
	increaseVoteBalance,
	decreaseBalance,
	decreaseVoteBalance,
	setDelegate,
	clearDelegate
} from "../store/actions";

export default function* updateVoteBalanceSaga() {
	// if necessary execute increaseVoteBalance for every increaseBalance execution
	yield takeEvery(increaseBalance, function*({ payload }) {
		if (yield select(hasDelegate, payload.walletAddress)) {
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(increaseVoteBalance(delegateAddress, payload.amount));
		}
	});

	// if necessary execute decreaseVoteBalance for every decreaseBalance execution
	yield takeEvery(decreaseBalance, function*({ payload }) {
		if (yield select(hasDelegate, payload.walletAddress)) {
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(decreaseVoteBalance(delegateAddress, payload.amount));
		}
	});

	yield takeEvery(setDelegate, function*({ payload }) {
		const balance = yield select(getBalance, payload.walletAddress);
		if (balance.isEqualTo(0) === false) {
			const delegateAddress = yield select(getDelegate, payload.walletAddress);
			yield put(increaseVoteBalance(delegateAddress, balance));

			if (yield select(hasPrevDelegate, payload.walletAddress)) {
				const prevDelegateAddress = yield select(
					getPrevDelegate,
					payload.walletAddress
				);
				yield put(decreaseVoteBalance(prevDelegateAddress, balance));
			}
		}
	});

	yield takeEvery(clearDelegate, function*({ payload }) {
		if (yield select(hasPrevDelegate, payload.walletAddress)) {
			const balance = yield select(getBalance, payload.walletAddress);
			if (balance.isEqualTo(0) === false) {
				const prevDelegateAddress = yield select(
					getPrevDelegate,
					payload.walletAddress
				);
				yield put(decreaseVoteBalance(prevDelegateAddress, balance));
			}
		}
	});
}
