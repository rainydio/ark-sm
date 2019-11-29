import readline from "readline";
import prettyoutput from "prettyoutput";
import stringlength from "string-length";
import clear from "clear";
import BigNumber from "bignumber.js";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./store/reducer";
import rootSaga from "./saga";
import {
	setGenesisBalance,
	executeBalanceTransfer,
	executeDelegateChoice
} from "./store/actions";

const address1 = "wallet1-address";
const address2 = "wallet2-address";
const address3 = "wallet3-address";
const address4 = "wallet4-address";
const address5 = "wallet5-address";

const actions = [
	setGenesisBalance(address1, new BigNumber(1500)),
	executeDelegateChoice(address1, 1, address1),
	executeDelegateChoice(address2, 1, address2),
	executeDelegateChoice(address3, 1, address3),
	executeDelegateChoice(address4, 1, address4),
	executeDelegateChoice(address5, 1, address5),
	executeBalanceTransfer(address1, 2, address2, new BigNumber(200)),
	executeBalanceTransfer(address1, 3, address3, new BigNumber(300)),
	executeBalanceTransfer(address1, 4, address4, new BigNumber(400)),
	executeBalanceTransfer(address1, 5, address5, new BigNumber(500)),
	executeDelegateChoice(address1, 6, address3),
	executeDelegateChoice(address2, 2, address3)
];

const createCollectorMiddleware = () => {
	let collected = [];
	const collectorMiddleware = () => next => action => {
		collected.push(action);
		return next(action);
	};
	collectorMiddleware.reset = () => {
		collected = [];
	};
	collectorMiddleware.get = () => {
		return collected;
	};
	return collectorMiddleware;
};

const padRight = (str: string, length: number) => {
	return str + " ".repeat(length - stringlength(str));
};

const show = (a: number) => {
	const collectorMiddleware = createCollectorMiddleware();
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		reducer,
		applyMiddleware(collectorMiddleware, sagaMiddleware)
	);
	const rootSagaTask = sagaMiddleware.run(rootSaga);

	for (let i = 0; i < a; i++) {
		store.dispatch(actions[i]);
	}

	collectorMiddleware.reset();
	store.dispatch(actions[a]);

	const nav = actions.map((_, i) => (i === a ? `[${i}]` : ` ${i} `)).join("");
	console.log("Use left and right arrow keys to navigate:");
	console.log(nav);
	console.log();

	const state = store.getState();
	const stateJson = JSON.stringify(state);
	const stateObj = JSON.parse(stateJson);
	const stateLines = prettyoutput(stateObj).split("\n");

	const actionLines = collectorMiddleware
		.get()
		.map(action => JSON.stringify(action))
		.map(actionJson => JSON.parse(actionJson))
		.map(actionObj => prettyoutput(actionObj))
		.join("\n")
		.split("\n");

	const padSize = actionLines
		.map(l => stringlength(l))
		.reduce((max, length) => Math.max(max, length), 40);

	const count = Math.max(stateLines.length, actionLines.length);
	for (let i = 0; i < count; i++) {
		const actionLine = actionLines[i] || "";
		const stateLine = stateLines[i] || "";
		console.log(`${padRight(actionLine, padSize)}  |  ${stateLine}`);
	}

	rootSagaTask.cancel();
};

let a = 0;
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
	if (key.ctrl && key.name === "c") {
		process.exit(0);
	}
	if (key.name === "left") {
		a = Math.max(0, a - 1);
		clear();
		show(a);
	}
	if (key.name === "right") {
		a = Math.min(actions.length - 1, a + 1);
		clear();
		show(a);
	}
});

clear();
show(a);
