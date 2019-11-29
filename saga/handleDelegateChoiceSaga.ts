import { put } from "redux-saga/effects";
import { takeEveryTransaction } from "./effects";
import { executeDelegateChoice, setDelegate } from "../store/actions";

export default function* handleDelegateChoiceSaga() {
	yield takeEveryTransaction(executeDelegateChoice, function*({ payload }) {
		yield put(setDelegate(payload.walletAddress, payload.delegateAddress));
	});
}
