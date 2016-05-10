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
