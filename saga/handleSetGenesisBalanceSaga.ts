import { take, put } from "redux-saga/effects";
import { setBalance, setGenesisBalance } from "../store/actions";

export default function* handleSetGenesisBalanceSaga() {
	// take `setGenesisBalance` action once
	const { payload } = yield take(setGenesisBalance);
	// set genesis wallet balance
	yield put(setBalance(payload.walletAddress, payload.balance));
}
