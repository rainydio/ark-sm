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
		const oldVoteRank = yield select(getVoteRank, payload.delegateAddress);
		const newVoteRank = yield select(
			getNewHigherVoteRank,
			payload.delegateAddress
		);

		if (oldVoteRank !== newVoteRank) {
			yield put(setVoteRank(payload.delegateAddress, newVoteRank));
		}
	});

	yield takeEvery(decreaseVoteBalance, function*({ payload }) {
		const oldVoteRank = yield select(getVoteRank, payload.delegateAddress);
		const newVoteRank = yield select(
			getNewLowerVoteRank,
			payload.delegateAddress
		);

		if (oldVoteRank !== newVoteRank) {
			yield put(setVoteRank(payload.delegateAddress, newVoteRank));
		}
	});
}
