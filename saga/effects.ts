import { takeEvery, select, put, call } from "redux-saga/effects";
import { getNonce } from "../store/selectors";
import { incrementNonce } from "../store/actions";

export const takeEveryTransaction = function*(selector, cb) {
	yield takeEvery(selector, function*(action: { payload }) {
		const nonce = yield select(getNonce, action.payload.walletAddress);

		if (nonce === action.payload.walletNonce) {
			yield put(incrementNonce(action.payload.walletAddress));
			yield call(cb, action);
		}
	});
};
