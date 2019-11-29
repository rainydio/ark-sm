import { ActionMatchingPattern } from "@redux-saga/types";
import { takeEvery, select, put, call, ForkEffect } from "redux-saga/effects";
import { getNonce } from "../store/selectors";
import { incrementNonce, WalletTransaction } from "../store/actions";

/**
 * Take every transaction with matching nonce
 *
 * @param pattern transaction action creator
 * @param worker transaction handler
 */
export const takeEveryTransaction = function<P extends WalletTransaction>(
	pattern: P,
	worker: (action: ActionMatchingPattern<P>) => any
): ForkEffect<never> {
	return takeEvery(pattern, function*(action) {
		const nonce = yield select(getNonce, action.payload.walletAddress);
		if (nonce === action.payload.walletNonce) {
			yield put(incrementNonce(action.payload.walletAddress));
			yield call(worker, action);
		}
	});
};
