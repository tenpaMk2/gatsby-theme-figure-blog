---
date: 2023-03-25 21:09:00+9
tags:
  - プログラミング
  - Gatsby
  - Excalibur.js
---

Gatsbyで作ったサイトに
Excalibur.jsのゲームとかReactアプリとか、
別のビルドシステムでできたWebアプリを組み込む話。

<!-- more -->

Excalibur.jsのゲームなんかはビルドすると `index.html` と、
ゲームが使うアセット類がまとめてひとつのディレクトリにまとめて配置される。
これらをGatsbyで作ったブログに組み込みたい。

結論は `static` ディレクトリに全ファイルを入れるだけ↓。

```shell-session
example/static/
├── excalibur-dino-runner/
│   ├── index.2cdaf7bc.css
│   ├── index.2cdaf7bc.css.map
│   ├── index.b71e74eb.js
│   ├── index.b71e74eb.js.map
│   ├── index.html
│   ├── ...
│   └── title.png
├── favicon.ico
└── header.webp
```

`static` 直下がルート直下になる。
↑の例だと `excalibur-dino-runner` にアクセスしたければ、
`http://localhost:9000/excalibur-dino-runner/` でアクセスできる。

当然だがWebアプリ内のファイル類は相対パスでつながっている必要がある。
Excalibur.jsの例だと、 `index.html` からロードするjsファイルが
ルートパスになってたので注意。

Webアプリによっては、 `gatsby develop` では動作できないようだ。
Excalibur.jsのゲームはだめだった。
`gatsby build` して `gatsby serve` すれば動作する。
まぁ、アプリのデバッグは別でやってるだろうから、 `gatsby develop` にこだわる必要はないかな。

どうしてもやりたい場合は、GatsbyのPage APIで空っぽのページを作っておいて、
`<iframe>` でhtmlを読み込めば良いって情報もあった。こっちは試してない。

**Page APIで作ったページのURLと、 `static` ディレクトリに置いたWebアプリのURLが被らないように注意** 。
もし被ってても `gatsby build` するときにエラーは出ないっぽい...なぜ😭。
