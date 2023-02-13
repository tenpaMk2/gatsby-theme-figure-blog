---
date: "2023-01-09 19:20"
tags:
  - プログラミング
---

[qiita](https://qiita.com/frozenbonito/items/8230d4a3cb5ea1b32802)
に書いてあった。

> workspace を追加するには -w オプションをつけて npm init を呼び出します。
>
> ```sh
> npm init -w packages/a
> ```

workspace つきの repo では、↓ ですべての npm package がインストールされる。

```sh
npm install
```

このとき、 `node_modules` フォルダは repo 直下にのみできる。
それぞれの workspace の dependencies にある module も
すべて repo 直下の `node_modules` にインストールされる。

また、workspace のディレクトリも
`node_modules` にシンボリックリンクが貼られる。
つまり、あたかも `npm install` したときと同じようにそれぞれの workspace が使えるようになる。

workspace の npm script を run するには ↓ のようにする。

```sh
npm -w example run deveop
```
