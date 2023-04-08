---
date: 2023-01-15 18:19:00+9
tags:
  - プログラミング
  - Gatsby
  - Tailwind CSS
---

公式docの手順に加えて、修正を加える必要がある。

`postcss.config.js` にて、
`tailwind.config.js` の場所を絶対パスで指定する必要がある ↓。

```js
module.exports = {
  plugins: {
    tailwindcss: { config: `${__dirname}/tailwind.config.js` },
    autoprefixer: {},
  },
};
```

`tailwind.config.js` にて、
同様に解析対象( `content` )をtheme内だけに留めるようにする。

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${__dirname}/src/pages/**/*.{js,jsx,ts,tsx}`,
    `${__dirname}/src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

themeを使う側では、tailwind公式の手順通りにセットアップすれば、
正常に使えるようになる。

参考になるのは
[このへん](https://github.com/tailwindlabs/tailwindcss.com/issues/1099)
とか
[このへん](https://github.com/gatsbyjs/gatsby/issues/19395)
かな。
