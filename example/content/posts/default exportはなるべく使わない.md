---
date: "2023-01-09 21:38"
tags:
  - プログラミング
  - JavaScript
  - Gatsby
---

↓ のサイトの記述に全面的に同意する。

[なぜ default export を使うべきではないのか？](https://engineering.linecorp.com/ja/blog/you-dont-need-default-export/)

> ## import 側の裁量で対象を自由に命名できてしまう

うんうん。

> ## エディタの自動 import が named export でのみ効果を発揮する

うん?...まぁ、うん。

ただし、Gatsby で `src/pages/` などでコンポーネントを生成するときのみ、
`default export` が必須なので注意。

[公式 doc](https://www.gatsbyjs.com/docs/creating-and-modifying-pages/)

> - By creating React components in the src/pages directory. (Note that you must make the component the default export.)
