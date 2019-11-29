A rather beautiful alternative approach.

```sh
yarn
yarn start
```

### [Redux]

Front-end library to manage state. The concept is to describe state transitions with action
objects. Applying actions through reducer function yields new state. Additionally selector functions are used to query state object. The whole thing can be viewed as data structure
where actions are used to mutate it, and selectors are used to read it.

#### Actions

Actions are simple objects describing change to be performed over state object.

```json
{
	"type": "NONCE_INCREMENT",
	"payload": {
		"walletAddress": "wallet2-address"
	}
}
```

```json
{
	"type": "VOTE_BALANCE_INCREASE",
	"payload": {
		"delegateAddress": "wallet3-address",
		"amount": 300
	}
}
```

#### Reducer

Reducer is a function taking state and action returning new state.

```js
const newState = [
	action1,
	action2,
	action3,
	action4,
	action5,
	action6,
	action7
].reduce(reducer, oldState);
```

Redux is just a library over this concept providing simple middleware api and methods such as `dispatch` and `getState`.

### [Redux-Saga]

It's redux middleware to manage side-effects. It can work without redux too.

[redux]: https://redux.js.org/
[redux-saga]: https://redux-saga.js.org/
