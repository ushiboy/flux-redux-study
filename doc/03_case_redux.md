# Redux

## 今回の趣旨

ReactによるカウンターアプリケーションをReduxを使って実装してみる。

Fluxとの違いをざっと把握する。

CounterコンポーネントはReactによる実装で作成したCounterクラスを再利用する。

## Redux単体での動きを確認

```
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm start
```

src/app-redux.js の内容を見つつ、localhost:3000/index-redux.html を開いて動きを確認。

## Reduxの登場人物

[TBD]

## 実装

src/redux/constants.js
```javascript
export const UPDATE_COUNTER = 'UPDATE_COUNTER';
```

src/redux/reducers.js
```javascript
import { UPDATE_COUNTER } from './constants';

export function count(state = 0, action) {
  switch (action.type) {
    case UPDATE_COUNTER:
      return state += action.payload.value;
    default:
      return state;
  }
}
```

src/redux/actions.js
```javascript
import { UPDATE_COUNTER } from './constants';

export function plusCounter() {
  return {
    type: UPDATE_COUNTER,
    payload: {
      value: 1
    }
  };
}

export function minusCounter() {
  return {
    type: UPDATE_COUNTER,
    payload: {
      value: -1
    }
  };
}
```

src/redux/App.js
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import { plusCounter, minusCounter } from './actions';

class App_ extends React.Component {

  render() {
    return (
      <Counter count={this.props.count}
        onClickMinus={this.handleMinus.bind(this)}
        onClickPlus={this.handlePlus.bind(this)} />
    );
  }

  handlePlus() {
    this.props.actions.plusCounter();
  }

  handleMinus() {
    this.props.actions.minusCounter();
  }
}

function mapStateToProps(state) {
  const { count } = state;
  return { count };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      plusCounter,
      minusCounter
    }, dispatch)
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(App_);

export default App;
```

src/app-redux.js
```javascript
import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './redux/App';
import { count } from './redux/reducers';

const combinedReducers = combineReducers({
  count
});
const store = createStore(combinedReducers);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
```

## 非同期API

src/redux/actions.js
```javascript
import { UPDATE_COUNTER } from './constants';

export function fetchCount() {
  return dispatch => {
    fetch('/api/count')
    .then(res => {
      return res.json();
    })
    .then(json => {
      dispatch({
        type: UPDATE_COUNTER,
        payload: json
      });
    });
  };
}

export function plusCounter() {
  return dispatch => {
    fetch('/api/vote', {
      method: 'POST'
    })
    .then(res => {
      return res.json();
    })
    .then(json => {
      dispatch({
        type: UPDATE_COUNTER,
        payload: json
      });
    });
  };
}

export function minusCounter() {
  return dispatch => {
    fetch('/api/vote', {
      method: 'DELETE'
    })
    .then(res => {
      return res.json();
    })
    .then(json => {
      dispatch({
        type: UPDATE_COUNTER,
        payload: json
      });
    });
  };
}
```

src/redux/reducers.js
```javascript
import { UPDATE_COUNTER } from './constants';

export function count(state = 0, action) {
  switch (action.type) {
    case UPDATE_COUNTER:
      return state = action.payload.count;
    default:
      return state;
  }
}
```

src/redux/App.js
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import { plusCounter, minusCounter, fetchCount } from './actions';

class App_ extends React.Component {

  componentDidMount() {
    this.props.actions.fetchCount();
  }

  render() {
    return (
      <Counter count={this.props.count}
        onClickMinus={this.handleMinus.bind(this)}
        onClickPlus={this.handlePlus.bind(this)} />
    );
  }

  handlePlus() {
    this.props.actions.plusCounter();
  }

  handleMinus() {
    this.props.actions.minusCounter();
  }
}

function mapStateToProps(state) {
  const { count } = state;
  return { count };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchCount,
      plusCounter,
      minusCounter
    }, dispatch)
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(App_);

export default App;
```

src/redux/app-redux.js
```javascript
import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';

import App from './redux/App';
import { count } from './redux/reducers';

const combinedReducers = combineReducers({
  count
});
const createStoreWithMiddleware = applyMiddleware(thunkMiddleWare)(createStore);
const store = createStoreWithMiddleware(combinedReducers);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
```
