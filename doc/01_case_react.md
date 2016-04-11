# Reactの復習

## 前回までのあらすじ

[ushiboy/study-react](https://github.com/ushiboy/study-react) でやったこと。

* [公式のGetting Started（当時）のようなこと](https://github.com/ushiboy/study-react/tree/master/01_getting_started)
* [公式のTutorial（当時）のようなこと + α](https://github.com/ushiboy/study-react/tree/master/02_tutorial)
* [Babelを使ってECMASCript2015で書き換え](https://github.com/ushiboy/study-react/tree/master/03_es6_on_babel)

をReactJS v0.13.3でやりました。そして、時は流れて…

今回はv15.0.xを対象。

## ReactJS v15.0.x

雑に変更点を振り返り。

### v0.13.x から v0.14.x への主な変更点

* DOM関連の部分がreact-domに分離され、reactはコアになった。
* refによる参照でDOM Nodeが取れるようになったので、React.findDOMNode(this.refs.author)しなくて良くなった。
* ステートレスなコンポーネントの簡易な定義方法が追加された。

もっと詳しく知りたい方は[こちら](http://blog.koba04.com/post/2015/09/22/react-js-v014-changes/)などを参考に。

### v0.14.x から v15.0.x への主な変更点

* バージョンがはじけ飛んだ。
* data-reactidがなくなった。

もっと詳しく知りたい方は[こちら](http://blog.koba04.com/post/2016/03/09/react-js-v15-changes/)などを参考に。


## カウンターアプリケーションの作成

"+"ボタンと"-"ボタンでカウントを増減するアプリケーションを作成。ES2015で。

src/components/Counter.js
```javascript
import React from 'react';

export default class Counter extends React.Component {

  render() {
    const { count, onClickPlus, onClickMinus } = this.props;
    return (
      <div>
        <div>{count}</div>
        <button onClick={onClickPlus}>+</button>
        <button onClick={onClickMinus}>-</button>
      </div>
    );
  }

}
```

src/app-react.js
```javascript
import React from 'react';
import { render } from 'react-dom';
import Counter from './components/Counter';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      count: props.initialCount
    };
  }

  render() {
    return (
      <Counter count={this.state.count}
        onClickMinus={this.handleMinus.bind(this)}
        onClickPlus={this.handlePlus.bind(this)} />
    );
  }

  handlePlus() {
    this.setState({
      count: this.state.count + 1
    });
  }

  handleMinus() {
    this.setState({
      count: this.state.count - 1
    });
  }
}

render(
  <App initialCount={0} />,
  document.getElementById('app')
);
```

## 発展

### propまわりの定義を使う

src/components/Counter.js
```javascript
import React from 'react';

export default class Counter extends React.Component {
  // 省略
}
Counter.propTypes = {
  count: React.PropTypes.number.isRequired,
  onClickPlus: React.PropTypes.func.isRequired,
  onClickMinus: React.PropTypes.func.isRequired
};
```

src/app-react.js
```javascript
import React from 'react';
import { render } from 'react-dom';
import Counter from './components/Counter';

class App extends React.Component {
  // 省略
}
App.propTypes = { initialCount: React.PropTypes.number };
App.defaultProps = { initialCount: 0 };

render(
  <App />,
  document.getElementById('app')
);
```

### ステートレスなコンポーネント定義で書き換え

src/components/Counter.js
```javascript
import React from 'react';

export default function Counter(props) {
  const { count, onClickPlus, onClickMinus } = props;
  return (
    <div>
      <div>{count}</div>
      <button onClick={onClickPlus}>+</button>
      <button onClick={onClickMinus}>-</button>
    </div>
  );
}
Counter.propTypes = {
  count: React.PropTypes.number.isRequired,
  onClickPlus: React.PropTypes.func.isRequired,
  onClickMinus: React.PropTypes.func.isRequired
};
```

## 参考

http://facebook.github.io/react/docs/reusable-components.html
http://facebook.github.io/react/docs/reusable-components.html#stateless-functions
