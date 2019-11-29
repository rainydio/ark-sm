import { takeEvery, select, put } from "redux-saga/effects";
import {
	increaseVoteBalance,
	decreaseVoteBalance,
	setVoteRank
} from "../store/actions";
import {
	getNewHigherVoteRank,
	getNewLowerVoteRank,
	getVoteRank
} from "../store/selectors";

export default function* updateVoteRanksSaga() {
	yield takeEvery(increaseVoteBalance, function*({ payload }) {
		const delegateAddress = payload.delegateAddress;
		const oldVoteRank = yield select(getVoteRank, delegateAddress);
		const newVoteRank = yield select(getNewHigherVoteRank, delegateAddress);
		if (oldVoteRank !== newVoteRank) {
			yield put(setVoteRank(delegateAddress, newVoteRank));
		}
	});

	yield takeEvery(decreaseVoteBalance, function*({ payload }) {
		const delegateAddress = payload.delegateAddress;
		const oldVoteRank = yield select(getVoteRank, delegateAddress);
		const newVoteRank = yield select(getNewLowerVoteRank, delegateAddress);
		if (oldVoteRank !== newVoteRank) {
			yield put(setVoteRank(payload.delegateAddress, newVoteRank));
		}
	});
}
