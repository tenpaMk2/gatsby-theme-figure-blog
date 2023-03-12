---
date: "2023-03-12 17:53"
tags:
  - Gatsby
  - JavaScript
  - プログラミング
---

GatsbyのThemeで使っているpluginのoptionを、Themeのユーザから変えれるようにしたい話。

<!-- more -->

拙作のGatsby Themeでは `gatsby-remark-images` なんかを当然使っているわけだけど、
これのOptionってユーザが自由に変えれないと不便だよね。
なので変えれるようにした。

結論から言うと、Theme側の `gatsby-node.js` にて、
↓のように `module.exports` にオブジェクトじゃなくて関数を渡すようにすると、
引数にThemeのOptionが渡ってくる。

```js
module.exports = (themeOptions) => ({
  plugins: [

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {...{
              maxWidth: 1024, // sync the value of `max-w-screen-lg` by Tailwind CSS.
              quality: 90,
              wrapperStyle: (image) =>
                `max-width:${(image.aspectRatio * 100).toFixed(2)}vh`, // See [issue: Can't specify max-width](https://github.com/gatsbyjs/gatsby/issues/15578) .
              backgroundColor: "transparent",
            }, ...themeOptions.gatsbyRemarkImages},
          },
        ],
      },
    },
  ],
});
```

あとは、スプレッド構文なりを使って、
ThemeのOptionで指定があるところだけ書き換えれば良い。

一応、Themeを使う側の `gatsby-node.js` を載せておくと↓。

```js
    {
      resolve: `@tenpamk2/gatsby-theme-figure-blog`,
      options: {
        gatsbyRemarkImages: {
          quality: 50,
        }
      },
    },
```
