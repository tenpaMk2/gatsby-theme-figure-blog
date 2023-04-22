# @tenpamk2/gatsby-theme-figure-blog

![example-1](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/example-1.png)

[English README is here.](https://github.com/tenpaMk2/gatsby-theme-figure-blog/tree/main/theme)

美少女フィギュア写真に最適なブログテーマです。
美少女フィギュアレビューブログをすぐにでも始めれます❗

## デモ

[デモはこちら❗](https://gatsby-starter-figure-blog.netlify.app/)

## 作者のブログ

[tenpaMk2's blog](https://tenpamk2-blog.netlify.app/)

## 特徴

- 写真を可能な限り大きく見せます
- レスポンシブ
- ヒーロー画像(アイキャッチとかキービジュアルとか呼ばれてるもの)
  - もし縦長画像の場合、画像上部にフォーカスします。フィギュアの顔は通常は上部にあるからね❗
- 記事タイトルをファイル名から生成
- ピュアMarkdown(MDXは非サポート)
- [Special hooks](#special-hooks)
- [prism.js](https://prismjs.com/) によるコードのシンタックスハイライト
- ダークモードのみ
- タグページ、アーカイブページ
- タグページとアーカイブページでのカードレイアウト
- ページネーション
- デバッグ用ページ
- Tailwind CSS
- `Intl` による部分的なロケール対応

## インストール

```sh
npm install @tenpamk2/gatsby-theme-figure-blog
```

このテーマはTailwind CSSを使います。
なので、プラグインのオプションを設定したりいくつかのファイルを作成する必要があります。
各パッケージは、このテーマがdependenciesに指定しているので、
個別にインストールする必要はありません。

まず、PostCSSプラグインを有効にします。

```js
  plugins: [
    "gatsby-plugin-postcss",
  ]
```

`postcss.config.js` を作成して、プロジェクトのトップディレクトリに配置します。

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`tailwind.config.js` を作成して、プロジェクトのトップディレクトリに配置します。
`content` オプションをお好きなように変えてください。

```js
const defaultOptions = require(`@tenpamk2/gatsby-theme-figure-blog/tailwind.config.js`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...defaultOptions,
  ...{
    content: [
      ...defaultOptions.content,
      `./src/**/*.{js,jsx,mjs,ts,tsx}` // Change this as you like.
    ],
  },
};
```

`src/styles/global.css` を作成します。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`gatsby-browser.js` にて `import` を追加します。

```js
import "./src/styles/global.css";
```

以上❗

### Starterとしてインストール

```sh
npx gatsby new gatsby-starter-figure-blog https://github.com/tenpaMk2/gatsby-starter-figure-blog
```

[Starterのコードはこちら。](https://github.com/tenpaMk2/gatsby-starter-figure-blog)

## 非サポートの機能

### RSSフィード

このテーマはRSSフィードを作成しません。
[gatsby-plugin-feed](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/)
を使ってください。

このテーマはGraphQLで記事情報( `MarkdownPost` ノード)を提供します。
このノードはRSSに便利なフィールド( `rssContentEncoded` と `rssDescription` )を持っています。
これらは↓のようにして、 `gatsby-plugin-feed` のオプションに使えます。

```js
{
  // See [gatsby-plugin-feed doc](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/) .
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
      {
        site {
          siteMetadata {
            # All fields are pass through as \`feedOptions\` .
            title # This is overwritten by \`title\` of \`feeds\` .
            description
            siteUrl
            site_url: siteUrl
          }
        }
      }
    `,
    feeds: [
      {
        serialize: ({ query: { site, allMarkdownPost } }) =>
          allMarkdownPost.nodes.map(
            ({ date, rssContentEncoded, rssDescription, slug, title }) => ({
              date,
              title,
              description: rssDescription,
              url: new URL(slug, site.siteMetadata.siteUrl).href, // Unlike Gatsby, URL must be percent-encoded in RSS.
              custom_elements: [{ "content:encoded": rssContentEncoded }],
            })
          ),
        query: `
          {
            allMarkdownPost(limit: 20, sort: {date: DESC}) {
              nodes {
                date
                rssContentEncoded
                rssDescription
                slug
                title
              }
            }
          }
        `,
        output: "/rss.xml",
        title: "Your site's RSS feed | All",
      },
    ],
  },
},
```

### ファビコン(Favicons)

このテーマはファビコン(Favicons)を生成せず、 `<link rel="icon">` タグも挿入しません。
[gatsby-plugin-manifest](https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/)
を使ってください。

### Google analytics

このテーマはgtagを埋め込みません。
[gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/)
を使ってください。

### コメント欄

このテーマはコメント欄を持ちません。

## Special hooks

特定の条件にマッチしたMarkdownは特殊なコンポーネントに変換されます。

### 内部リンクのポストリンクカード

内部リンクをポストリンクカードに変換します。
カードはリンク先記事のヒーロー画像を表示するので、見た目がクールです❗

例えば、↓のようなMarkdownを書いたとき、

```md
Link card test.

[Portrait test](/test-posts/hero-image-portrait-1/)
```

↓のようなポストリンクカードが生成されます。

![ポストリンクカードサンプル](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/post-link-card.png);

このHookは↓の条件下で動作します。

- リンクが外部リンクではなく内部リンクであること
- リンクが記事中のトップレベルにあること
  - 例えば、引用ブロックの中にあるリンクは変換されません。
- リンクがパラグラフ中で唯一の要素であること
  - 例えば、文章の直後の行に書かれたリンクは変換されません。
- リンクが画像リンクじゃないこと

### 画像比較スライダー

2枚の画像を画像比較スライダー(
[react-compare-slider](https://github.com/nerdyman/react-compare-slider)
)に変換します。
サイトの閲覧者にインタラクティブに画像を比較させたいときにとても便利です❗

例えば、↓のようなMarkdownを書いたとき、

```md
![Focus on Miyu](../images/compare-left.jpg "left")
![Focus on Chloe](../images/compare-right.jpg "right")
```

↓のような画像比較スライダーに変換されます。

![画像比較スライダーサンプル](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/image-compare-slider.png);

このHookは↓の条件下で動作します。

- 画像のタイトルが `left` か `right` で始まること
- 両方の画像が記事中のトップレベルにあること
- 両方の画像が同じパラグラフにあること
  - これは、Markdown中の画像リンクと画像リンクの間に空白行を開けれないことを意味します。

## 使い方

### `siteMetadata`

| Key                | example                               | Description                                             |
| :----------------- | :------------------------------------ | :------------------------------------------------------ |
| `title`            | `'My Blog'`                           | ブログタイトル。                                        |
| `description`      | `'The blog about japanese figure!!'`  | ブログの説明文。                                        |
| `siteUrl`          | `'https://your-blog.com'`             | ブログのOrigin。末尾に `/` を挿れないでください。       |
| `author.name`      | `'your name'`                         | サイト管理者名。サイドバーのBioに表示されます。         |
| `author.summary`   | `'I'm a software engineer in Japan.'` | サイト管理者の自己紹介。サイドバーのBioに表示されます。 |
| `social.twitter`   | `'@youraccount'`                      | Twitterアカウント。不要であれば `''` にしてください。   |
| `social.instagram` | `'your_account'`                      | Instagramアカウント。不要であれば `''` にしてください。 |
| `social.github`    | `'yourAccount'`                       | GitHubアカウント。不要であれば `''` にしてください。    |
| `menuLinks`        | `[...]`                               | サイト上部のヘッダのメニューのリンク。                  |
| `menuLinks[].name` | `'About'`                             | リンクテキスト。                                        |
| `menuLinks[].link` | `'/about/'`                           | リンク。                                                |

### Theme options

| Key                              | Default Value                                                                                                      | Description                                                                                                                                                  |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `archivesPath`                   | `'archives'`                                                                                                       | アーカイブページのURL。                                                                                                                                      |
| `basePath`                       | `'base'`                                                                                                           | このテーマで生成するページのルートURL。                                                                                                                      |
| `cardsPerPage`                   | `12`                                                                                                               | 1ページあたりのカード数。                                                                                                                                    |
| `debugPath`                      | `'debug'`                                                                                                          | デバッグページのURL。                                                                                                                                        |
| `descriptionPrunedLength`        | `128`                                                                                                              | 記事要約の文字数。                                                                                                                                           |
| `descriptionTruncate`            | `false`                                                                                                            | 記事要約で英単語ごとに区切るか(日本語ユーザは `true` が推奨。日本語の文章は1文が1単語扱いになるため。)                                                       |
| `externalLinks`                  | `[]`                                                                                                               | サイドバーの外部リンク。                                                                                                                                     |
| `externalLinks[].name`           | -                                                                                                                  | 外部リンクテキスト。                                                                                                                                         |
| `externalLinks[].url`            | -                                                                                                                  | 外部リンク。                                                                                                                                                 |
| `intlYear`                       | `{ year: 'numeric' }`                                                                                              | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) の『年』向けオプション。         |
| `intlYearAndMonth`               | `{ year: 'numeric', month: 'short' }`                                                                              | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) の『年』と『月』向けオプション。 |
| `intlMonth`                      | `{ month: 'short' }`                                                                                               | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) の『月』向けオプション。         |
| `intlMonthAndDate`               | `{ month: 'short', day: 'numeric'}`                                                                                | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) の『月』と『日』向けオプション。 |
| `intlTime`                       | `{ timeStyle: 'short', hour12: false}`                                                                             | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) の時刻向けオプション             |
| `locale`                         | `'en-US'`                                                                                                          | ロケール。[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) を参照してね(日本語ユーザは `ja-JP` を推奨)。     |
| `pagesPath`                      | `'pages'`                                                                                                          | ページネーションの2ページ目移行のURL。                                                                                                                       |
| `postPath`                       | `'post'`                                                                                                           | 記事ページのURL。                                                                                                                                            |
| `postsPerPage`                   | `6`                                                                                                                | メインページの1ページあたりの記事数。                                                                                                                        |
| `rssNeedFullContent`             | `false`                                                                                                            | RSS用の `MarkdownPost.rssContentEncoded` にて記事全文を含めるかどうか。                                                                                      |
| `rssPruneLength`                 | `128`                                                                                                              | RSS用の `MarkdownPost.rssDescription` の文字数。                                                                                                             |
| `rssTruncate`                    | `false`                                                                                                            | RSS用の `MarkdownPost.rssContentEncoded` と `MarkdownPost.rssDescription` で英単語ごとに区切るか(日本語ユーザは `true` を推奨)。                             |
| `tagsPath`                       | `'tags'`                                                                                                           | タグページのURL。                                                                                                                                            |
| `options***`                     | -                                                                                                                  | プラグインオプション。何をするか理解していなければ、触らないでください。                                                                                     |
| `optionsGatsbyRemarkImages`      | (See [gatsby-config.mjs](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/gatsby-config.mjs) ) | `gatsby-remark-images` オプション。画像の品質、 `max-width` 、AVIFの生成要否、Breakpointsの設定などを変更できます。                                          |
| `optionsGatsbyTransformerRemark` | (See [gatsby-config.mjs](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/gatsby-config.mjs) ) | `gatsby-transformer-remark` オプション。 `excerpt_separator` を変えれます。                                                                                  |

### MarkdownPostとMarkdownPage

Markdownから2タイプのページを生成できます。

MarkdownPostは記事ページです。
Markdownを↓のディレクトリに配置することで生成できます。

- `content/posts/記事タイトル.md`
  - URL: `/記事タイトル/`
- `content/posts/あなたの/記事/タイトル/index.md`
  - URL: `/あなたの/記事/タイトル/`

MarkdownPageは固定ページです。
Markdownを↓のディレクトリに配置することで生成できます。

- `content/pages/記事タイトル.md`
  - URL: `/記事タイトル/`
- `content/pages/あなたの/記事/タイトル/index.md`
  - URL: `/あなたの/記事/タイトル/`

### フロントマター(Frontmatter)

すべてのFrontmatterのKeyはオプショナルです。

| Key            | MarkdownPost | MarkdownPage | Description                                                                      |
| :------------- | :----------: | :----------: | :------------------------------------------------------------------------------- |
| `slug`         |      O       |      O       | ページのルート相対URL。省略された場合、ファイルパスから決定されます。            |
| `title`        |      O       |      O       | ページのタイトル。省略された場合、ファイル名から決定されます。                   |
| `canonicalUrl` |      O       |      O       | Canonical URL (絶対URL)。省略された場合、 `slug` から決定されます。              |
| `heroImage`    |      O       |      O       | ヒーロー画像への相対パス。省略された場合、デフォルトのno-image画像が使われます。 |
| `heroImageAlt` |      O       |      O       | ヒーロー画像のAltテキスト。                                                      |
| `isNSFW`       |      O       |      O       | `true` のとき、記事がGoogle向けにアダルトコンテンツとして設定されます。          |
| `tags`         |      O       |      -       | タグの **配列** 。                                                               |
| `date`         |      O       |      -       | 日付。 `2023-04-01 23:30:00+9` のようなYAMLの日付形式を推奨します。              |

### Example usage

[`example` の `gatsby-config.mjs`](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/example/gatsby-config.mjs)
やMarkdownを見てください。

### ヘッダー画像を変える

画像を `static/header.webp` に配置してください。

### Bio画像を変える

画像を `src/@tenpamk2/gatsby-theme-figure-blog/images/bio.svg` に配置してください。
もしくは、お好きな `bio-icon.js` を作成して、 `src/@tenpamk2/gatsby-theme-figure-blog/components/bio-icon.js` に配置することで
[シャドーイング(Shadowing)](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/)
してください。

### プレースホルダ画像(no-image画像)を変える

`src/@tenpamk2/gatsby-theme-figure-blog/images/no-image.png` に画像を配置してください。
解像度は800x450にすべきです。

もし他の解像度を使いたい場合、
`seo.js` をシャドーイングして、OGP用の解像度設定を変えてください。

```js
import noImage from "../images/no-image.png";
const Seo = ({
  // ...
  image: {
    src: imageSrc,
    width: imageWidth,
    height: imageHeight,
    alt: imageAlt,
  } = {
    src: noImage,
    width: 800,
    height: 450,
    alt: `no image`,
  },
  // ...
}) => {
 // ...
}
```

### コードシンタックスハイライトテーマを変える

お好きなPrism.jsテーマを `gatsby-browser.js` でインポートしてください。

```js
// See [gatsby-remark-prismjs](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/) .
import "prismjs/themes/prism-tomorrow.css";
```

### Markdownスタイルを変える

このテーマではMarkdownのスタイリングのために
[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
を使っています。

もしスタイルを変えたい場合、 `tailwind.config.js` で `typograhy` オプションを上書きしてください。
詳細は
[このテーマの `tailwind.config.js`](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/tailwind.config.js)
を見てください。

## クレジット(Credits)

|            Item             | Link                                                                           |
| :-------------------------: | :----------------------------------------------------------------------------- |
| Magnifying Glass SVG Vector | [Icooon Mono in SVG Repo](https://www.svgrepo.com/svg/479944/magnifying-glass) |
|  Twitter Boxed SVG Vector   | [instructure-ui in SVG Repo](https://www.svgrepo.com/svg/501411/twitter-boxed) |
|      Github SVG Vector      | [scarlab in SVG Repo](https://www.svgrepo.com/svg/508076/github)               |
|    Instagram SVG Vector     | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/497210/instagram)            |
|       Menu SVG Vector       | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/497274/menu)                 |
|   Close Circle SVG Vector   | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/496952/close-circle)         |
