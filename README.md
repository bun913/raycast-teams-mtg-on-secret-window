# Teams MTG on Secret

## 背景

- 複数のTeams組織に所属している
    - 例えば複数のお客様とやり取りをして、いずれも別の組織にゲストユーザーとして招待いただいている
- オンラインMTG時に組織外のユーザーでも参加できる会議URLを共有いただくことがよくある
- その際、事故防止のため以下のような手順を毎回行っている
    - シークレットブラウザでTeams会議を開く
    - 名前を入力する
    - ビデオ・マイクをオンにする
    - 背景をぼかす
- これら手順を省略するため、コマンドで素早く実行できるようにする

## 前提条件

- node コマンドが利用できる
- playwrightが利用できる
    - `npx playwright install` が実行済み

## 利用方法のイメージ

- 本リポジトリをcloneします
- クローンしたディレクトリに`cd`で移動してください
- `npm install` を実行してください
    - 実行後に`node_modules` ディレクトリが作成されていることを確認してください
- src/browserOperation.ts の `ここにあなたの名前を入れてください` という場所にTeams会議で表示したい名前を入力してください
- `npm run build` を実行してアプリケーションをビルドしてください
    - `dist` ディレクトリにjsファイルが作成されればOKです
- zshrcなどに以下のように関数を書きます

```bash
# TeamsのURLをシークレットモードで開き自動入力を済ませる
teams() {
  # {PathToCloneDir}にはgit cloneしたディレクトリを指定してください
  node {PathToCloneDir}/dist/app.js "$1"
}
```

- `teams "Teams会議のURL"`と実行すると、シークレットブラウザで開き各種入力を自動化してくれます

![image](./docs/images/teams-on-secret-auto-input.jpg)
