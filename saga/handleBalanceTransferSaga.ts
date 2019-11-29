import { put } from "redux-saga/effects";
import { takeEveryTransaction } from "./effects";
import {
	decreaseBalance,
	increaseBalance,
	executeBalanceTransfer
} from "../store/actions";

/**
 * Handle `executeBalanceTransfer` action
 */
export default function* handleBalanceTransferSaga() {
	// take every `executeBalanceTransfer` transaction
	yield takeEveryTransaction(executeBalanceTransfer, function*({ payload }) {
		// decrease sender balance
		yield put(decreaseBalance(payload.walletAddress, payload.amount));
		// increase recipient balance
		yield put(increaseBalance(payload.destinationAddress, payload.amount));
	});
}
