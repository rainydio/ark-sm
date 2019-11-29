import { fork } from "redux-saga/effects";
import updateVoteBalanceSaga from "./updateVoteBalanceSaga";
import updateVoteRanksSaga from "./updateVoteRanksSaga";
import handleSetGenesisBalanceSaga from "./handleSetGenesisBalanceSaga";
import handleBalanceTransferSaga from "./handleBalanceTransferSaga";
import handleDelegateChoiceSaga from "./handleDelegateChoiceSaga";

export default function* rootSaga() {
	yield fork(updateVoteBalanceSaga);
	yield fork(updateVoteRanksSaga);

	yield fork(handleSetGenesisBalanceSaga);
	yield fork(handleBalanceTransferSaga);
	yield fork(handleDelegateChoiceSaga);
}
