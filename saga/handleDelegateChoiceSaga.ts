import { put } from "redux-saga/effects";
import { takeEveryTransaction } from "./effects";
import { executeDelegateChoice, setDelegate } from "../store/actions";

export default function* handleDelegateChoiceSaga() {
	// take every correct `executeDelegateChoice` transaction
	yield takeEveryTransaction(executeDelegateChoice, function*({ payload }) {
		// set delegate address
		yield put(setDelegate(payload.walletAddress, payload.delegateAddress));
	});
}
