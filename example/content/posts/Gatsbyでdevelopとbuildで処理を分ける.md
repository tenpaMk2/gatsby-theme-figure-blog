---
date: "2023-02-05 16:48"
tags:
  - プログラミング
  - JavaScript
  - Gatsby
---

`process.env.NODE_ENV` を使うと良い。

[Gatsby公式Doc](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)
に一応書いてある。

> You can not override certain environment variables that are used internally:
>
> - `NODE_ENV`
> - `PUBLIC_DIR`

どんな値になるかまでは書いてない(Nodeの常識なのか❓不親切だなあ)。
が、他の箇所の記載や実動作を見てると、↓の2択らしい。

- `"production"` : `gatsby build` のとき
- `"development"` : `gatsby develop` のとき

`develop` のときだけデバッグ用のページを作る場合は↓のようにすれば良い。

```js
if (process.env.NODE_ENV !== `production`) {
  createPage({
    path: slugify(basePath, `debug`),
    component: require.resolve(`./src/templates/debug.js`),
  });
}
```
