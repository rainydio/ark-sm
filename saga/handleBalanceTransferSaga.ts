import { put } from "redux-saga/effects";
import { takeEveryTransaction } from "./effects";
import {
	decreaseBalance,
	increaseBalance,
	executeBalanceTransfer
} from "../store/actions";

export default function* handleBalanceTransferSaga() {
	yield takeEveryTransaction(executeBalanceTransfer, function*({ payload }) {
		yield put(decreaseBalance(payload.walletAddress, payload.amount));
		yield put(increaseBalance(payload.destinationAddress, payload.amount));
	});
}
