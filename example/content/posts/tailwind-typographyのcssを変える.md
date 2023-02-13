---
date: "2023-01-09 16:16"
tags:
  - プログラミング
  - Tailwind CSS
---

[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
を使うと markdown の記事をサクッとスタイリングできて便利。

ただ、イマイチな部分もあるのでカスタマイズしたい。

`tailwind.config.js` の `module.exports` を ↓ のようにいじればカスタマイズできる。

```js
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: null,
            },
            "code::after": {
              content: null,
            },
            blockquote: {
              backgroundColor: `rgba(128, 128, 128, 0.2)`,
              overflow: `hidden`,
              quotes: null,
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },
          },
        },
      },
    },
  },
```

key(css のセレクタ)は
[公式 repo](https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js)
を参照。

`code::before` と `code::after` はデフォルトでは `` ` `` が設定されてる。
inline code 部の前後に `` ` `` がつく。
いらないので取っ払う。

`blockquote p:first-of-type::before` と `blockquote p:last-of-type::after` は
引用符をつけるつけないの設定。
いらないので取っ払う。

`blockquote` の `quotes` は引用符の文字コードを指定してる。
`blockquote p:first-of-type::before` などで抑制してるので放置しても良いけど、一応取っ払う。

`blockquote` の `overflow: hidden` は上下マージンがはみ出るのを防ぐ用。
引用文のなかにヘッダがあると、不自然に余白があくのを防ぐ。

`blockquote` の `backgroundColor` は半透明グレーにしておいた。
もともとは背景色がないので、引用ブロックの境界が分かりづらかった。

本当は `var(--tw-prose-pre-bg)` とかを指定して、デザインに統一性を出したかったが、
ダークモードと切り替えたときにうまくいかなかったので断念。
