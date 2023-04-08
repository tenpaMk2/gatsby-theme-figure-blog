---
date: 2023-02-05 16:48:00+9
tags:
  - プログラミング
  - JavaScript
  - Gatsby
---

2023/03/26追記あり。後述。

[Gatsby の Discussions](https://github.com/gatsbyjs/gatsby/discussions/31599)
に記載があった。
現状、ESM は使えなくて、Leko 氏が 2022/12/09 に ↓ の発言。

> We've started work on this, you can follow the milestone: <https://github.com/gatsbyjs/gatsby/milestone/15> (no ETA!)

ほぼ今からやるってさ。

Excalibur.js とか(あっちは TypeScript だけど)ですっかり `import` 文に馴染んじゃったので、
使えるなら使いたかった。
しょうがないので待つか。

## 2023-03-26 追記

と、思ったら、拡張子を `.mjs` にすれば使えるようだ。
↓のファイルで使えるようだ。

- `gatsby-node.mjs`
- `gatsby-config.mjs`
- ↑から使うユーティリティ系関数系ファイル
- (React系のファイルは最初から使える。拡張子は `.js` だけど。)

なお、 `gatsby-browser.js` は最初から `import` が使えてた。
これを `.mjs` にするとビルドが通らない。不思議。

`postcss.config.js` とか `tailwind.config.js` とかで使えるかは不明。
こっちはまあ使えなくてもそんなに気にならないので放置する。
