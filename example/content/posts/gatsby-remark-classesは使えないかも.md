---
title: gatsby-remark-classesは使えないかも
date: "2023-01-08 19:16"
tags:
  - プログラミング
  - Gatsby
---

[gatsby-remark-classes](https://www.gatsbyjs.com/plugins/gatsby-remark-classes/)
は使えないかもという話。

↓ のように、 `gatsby-transformer-remark` の plugin として使う。

```js
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: `gatsby-remark-classes`,
        options: {
          classMap: {
            "heading[depth=1]": "text-3xl",
          }
        }
      }
    ]
  }
}
```

`heading[depth=1]` は `<h1>` 相当。
他、詳細は公式 doc 見て。

で、本来なら ↑ の設定で `<h1>` には `text-3xl` class が付与されて、
フォントサイズが大きくなる。
が、実際にはされない。

Chrome のデバッガで見てると、class の付与まではうまくいってる。
が、 `/commons.css` に `.text-3xl` の記述がない。

他の `src/pages/*.js` や `src/templates/*.js` にて直接 `className="bg-red-400"` などと指定したクラスは
`/commons.css` に記述があった。

つまり、postCSS か tailwind にて、使われているクラス名を pickup する処理があって、
そこの pick 対象から漏れてしまっているっぽい。

結局、対策方法が分からんかった。
ので、 `gatsby-remark-classses` は使わないことにした。
`@tailwindcss/typography` でだいたい事足りたので良しとする。
