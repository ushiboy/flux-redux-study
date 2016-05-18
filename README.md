# Flux & Redux Study

勉強会用資料。

## アジェンダ

* [Reactの復習](./doc/01_case_react.md)
* [Flux](./doc/02_case_flux.md)
* [Redux](./doc/03_case_redux.md)

## 作業環境

### 起動方法

初回のみ先に**環境構築**を行う。

作業環境を起動するにはvagrantを起動し、sshでログインして作業スペースに移動、npm startを実行する。

```sh
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm start
```

ブラウザで http://localhost:3000 にアクセスしてページが表示されることを確認。

### 環境構築

初回のみ、npmの依存モジュールをインストールする。

```sh
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm install
```
