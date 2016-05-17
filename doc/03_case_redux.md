# Redux

## 今回の趣旨

ReactによるカウンターアプリケーションをReduxを使って実装してみる。

ReduxとFluxの違いをざっと把握する。

CounterコンポーネントはReactによる実装で作成したCounterクラスを再利用する。

## Reduxについて

### Reduxとは

[公式](http://redux.js.org/)

予測可能な状態変化を扱うためのライブラリ。
Fluxアーキテクチャから派生。

### Reduxの3原則

1. Single source of truth

アプリケーション全体の状態は、1 つのStore内のオブジェクト ツリーに格納される。

2. State is read-only

状態を変更させる唯一の方法はアクションの内容を表すオブジェクトを生成すること。

3. Changes are made with pure functions

アクションによる状態木の遷移方法として、reducerは純粋関数として記述する。
(以前の状態とアクションを受け取って次の状態を返すだけ)

[参考図](https://github.com/reactjs/redux/issues/653#issuecomment-216844781)


npmでの導入は次の通り。

```
$ npm install redux
```

## Redux単体での動きを確認

```
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm start
```

src/app-redux.js の内容を見つつ、http://localhost:3000/index-redux.html を開いて動きを確認。


## 実装

Reactと組み合わせて使うにはreduxコアの他にreact-reduxが必要。
npmでの導入は次の通り。
```
$ npm install react-redux
```

### 初期状態を描画するところまでの実装

#### Reducer

countに対して状態遷移を行うReducerを作成する。

src/redux/reducers.js
```javascript
export function count(state = 0, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

#### Container

Reduxの状態を表示するためのReactコンポーネント。

src/redux/App.js
```javascript
import React from 'react';
import { connect } from 'react-redux';

import Counter from '../components/Counter';

class App_ extends React.Component {

  render() {
    return (
      <Counter count={this.props.count}
        onClickMinus={this.handleMinus.bind(this)}
        onClickPlus={this.handlePlus.bind(this)} />
    );
  }

  handlePlus() {

  }

  handleMinus() {

  }
}

function mapStateToProps(state) {
  const { count } = state;
  return { count };
}

const App = connect(mapStateToProps)(App_);

export default App;
```

mapStateToPropsはContainerがReduxから受け取るprops（Redux側のstateから取り出す）を決めるためのハンドラ。

#### エントリポイント

combinedReducersでまとめたReducerを使ってcreateStoreでStoreを作る。
ContainerはProviderの子コンポーネントとして使う。

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

これで、初期状態を表示するまでが完了


### アクションの実装

#### アクション識別子を定数として用意

src/redux/constants.js
```javascript
export const UPDATE_COUNTER = 'UPDATE_COUNTER';
```

#### アクションを用意

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

#### Reducerにアクションの反応を追加

src/redux/reducers.js
```javascript
import { UPDATE_COUNTER } from './constants';   // <- 追加

export function count(state = 0, action) {
  switch (action.type) {
    case UPDATE_COUNTER:                        // <- 追加
      return state += action.payload.value;     // <- 追加
    default:
      return state;
  }
}
```

#### Containerにアクションを適用

src/redux/App.js
```javascript
import React from 'react';
import { bindActionCreators } from 'redux';     // <- 追加
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import { plusCounter, minusCounter } from './actions';  // <- 追加

class App_ extends React.Component {

  /** 省略 **/

  handlePlus() {
    this.props.actions.plusCounter();
  }

  handleMinus() {
    this.props.actions.minusCounter();
  }
}

/** 省略 **/

function mapDispatchToProps(dispatch) {     // <- 追加
  return {
    actions: bindActionCreators({
      plusCounter,
      minusCounter
    }, dispatch)
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(App_);     // <- mapDispatchToPropsを追加

export default App;
```

mapDispatchToPropsはContainerが利用できるアクションを設定するためのハンドラ。
bindActionCreatorsでdispatchメソッドと合成されたアクションを使える。

これでアクションを実行して状態を変更、描画するまでが完成。


## 非同期API

reduxコアでは非同期なアクションの取り扱いができないので、redux-thunkミドルウェアが必要。
npmでの導入は次の通り。
```
$ npm install redux-thunk
```

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
      return state = action.payload.count;      // <- 修正
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
import { plusCounter, minusCounter, fetchCount } from './actions';  // <- 修正

class App_ extends React.Component {

  componentDidMount() {                     // <- 追加
    this.props.actions.fetchCount();
  }

  /** 省略 **/
}

/** 省略 **/

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchCount,                           // <- 追加
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
import { createStore, combineReducers, applyMiddleware } from 'redux';      // <- 修正
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';                                  // <- 追加

import App from './redux/App';
import { count } from './redux/reducers';

const combinedReducers = combineReducers({
  count
});
const store = createStore(combinedReducers, undefined, applyMiddleware(thunk));   // <- 修正

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
```
