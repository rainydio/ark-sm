import { take, put } from "redux-saga/effects";
import { setBalance, setGenesisBalance } from "../store/actions";

export default function* handleSetGenesisBalanceSaga() {
	const { payload } = yield take(setGenesisBalance);
	yield put(setBalance(payload.walletAddress, payload.balance));
}
