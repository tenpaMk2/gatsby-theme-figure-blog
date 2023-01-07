<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Starter for creating a Gatsby Theme workspace
</h1>

```shell
gatsby new my-theme https://github.com/gatsbyjs/gatsby-starter-theme-workspace
cd my-theme
yarn workspace example develop
```

## Layout

```text
.
├── README.md
├── gatsby-theme-minimal
│   ├── README.md
│   ├── gatsby-config.js
│   ├── index.js
│   └── package.json
├── example
│   ├── README.md
│   ├── gatsby-config.js
│   ├── package.json
│   └── src
├── package.json
└── yarn.lock

3 directories, 10 files
```

### `gatsby-theme-minimal`

This directory is the theme package itself. You should rename this at
some point to be `gatsby-theme-{my-theme-name}`. Also change the
`package.json` name field and the corresponding dependency in the
example directory's `package.json`/`gatsby-config.js` to match the chosen name.

- `gatsby-theme-minimal/`
  - `gatsby-config.js`: An empty gatsby-config that you can use as a starting point for building functionality into your theme.
  - `index.js`: Since themes also function as plugins, this is an empty file that
    gatsby needs to use this theme as a plugin.
  - `package.json`: The dependencies that your theme will pull in when people install it. `gatsby` should be a `peerDependency`.

### `example`

This is an example usage of your theme. It should look the same as the
site of someone who installed and used your theme from npm.

- `example/`
  - `gatsby-config.js`: Specifies which theme to use and any other one-off config a site might need.
  - `src/`: Source code such as one-off pages or components that might live in
    a user's site.

You can run the example with:

```shell
yarn workspace example develop
```

## 🚀 Quick start (Gatsby Cloud)

Deploy this starter with one click on [Gatsby Cloud](https://www.gatsbyjs.com/cloud/):

[<img src="https://www.gatsbyjs.com/deploynow.svg" alt="Deploy to Gatsby Cloud">](https://www.gatsbyjs.com/dashboard/deploynow?url=https://github.com/gatsbyjs/gatsby-starter-theme-workspace)

## tailwind css

公式 doc の手順に加えて、修正を加える必要がある。

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
同様に解析対象( `content` )を theme 内だけに留めるようにする。

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

theme を使う側では、tailwind 公式の手順通りにセットアップすれば、
正常に使えるようになる。

参考になるのは
[このへん](https://github.com/tailwindlabs/tailwindcss.com/issues/1099)
とか
[このへん](https://github.com/gatsbyjs/gatsby/issues/19395)
かな。
