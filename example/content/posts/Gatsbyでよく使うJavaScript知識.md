---
date: 2023-02-11 09:23:00+9
tags:
  - プログラミング
  - JavaScript
  - Gatsby
---

[Qiitaにも投稿した。](https://qiita.com/tenpaMk2/items/70012117bbb8d123b592)

趣味でGatsbyをいじり始めて知見が溜まってきたのでメモる。

この知識を使った実際のソースは
[拙作の gatsby-theme(GitHub)](https://github.com/tenpaMk2/gatsby-theme-figure-blog)
に転がってるので、参考まで。

<!-- more -->

## 配列操作

Gatsby は配列操作を非常によく使う。

例えば、markdown の全記事は GraphQL で ↓ のように query する。

```graphql
{
  allMarkdownRemark {
    nodes {
      id
      frontmatter {
        tags
        title
      }
    }
  }
}
```

結果が `data.allMarkdownRemark.nodes` に配列として格納される。

で、記事タイトルを集めて element にしようと思ったら、↓ のように `Array.prototype.map()` を使う。

```jsx
const titles = nodes.map(({ title }) => <p key={title}>{title}</p>);
```

他には、特定の tag ごとに記事を集めようと思ったら、 `Array.prototype.filter()` を使う。

```jsx
const filtered = nodes.filter(({ frontmatter: { tags } }) =>
  tags.includes(`hoge`)
);
```

`Array.prototype.reduce()` だけはあまり使わないかな。

## 分割代入

配列の中身や、オブジェクトのプロパティを直接引っ張り出して変数に代入するやつ。

例えば、全記事を query した結果を ↓ のように処理してもよいが、

```jsx
const nodes = data.allMarkdownRemark.nodes;
// 以下、 `nodes` を使ってあれこれ
```

分割代入を使って ↓ のように書くともっとスマート。

```jsx
const {
  allMarkdownRemark: { nodes },
} = data;
// 以下、 `nodes` を使ってあれこれ
```

実際には、 query の結果を分割代入することが多い。
↓ は `useStaticQuery()` を使う場合の例。

```jsx
const {
  site: { siteMetadata },
} = useStaticQuery(
  graphql`
    query {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `
);
// 以下、 `siteMetadata` を使ってあれこれ
```

後は、React のコンポーネントの関数定義でもよく使う。 `children` とか ↓。

```jsx
import * as React from "react";

export const ButtonBase = ({ children }) => (
  <div className="flex min-w-[2rem] items-center justify-center whitespace-nowrap p-2">
    {children}
  </div>
);
```

注意としては、オブジェクトを掘り下げていく途中で `null` になる場合はエラーになる。
なので、確実に `null` じゃないプロパティまで分割代入する。
その続きは、↓ のようにオプショナルチェーンを使って `null` でも大丈夫なようにする。

```jsx
const name = siteMetadata?.author?.name || `NO NAME`;
const summary = siteMetadata?.author?.summary || ``;
```

分割代入時に名前を変えることもできる。

```js
const obj = { a: 1, b: 2, c: { x: 4, y: 5, z: 8 } };
const {
  a: hoge,
  c: { x: fuga },
} = obj;
console.log(hoge); // output => 1
console.log(fuga); // output => 4
```

場面に応じて、名前の意味を変えたほうが良いときや、
別々の field がたまたま同じ名前の field を持ってて重複回避したいときなどに便利。

## ECMAScript 2015 のオブジェクト初期化子

変数をそのままオブジェクトに突っ込むと、変数名が key になって、変数の値が value になるやつ。
[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Object_initializer)
に書いてある。

```js
const hoge = "fuga";
const piyo = { hoge };
// piyo => {hoge: "fuga"}
```

どこでも使うんだけど、強いて言うなら、
タグごとの記事数のカウント情報を作るときに使う ↓。

```jsx
const allTags = [`hoge`, `hoge`, `fuga`, `hoge`, `fuga`, `piyo`];
const tagInfos = [...new Set(allTagNames)].map((name) => {
  const count = allTags.filter((n) => n === name).length;
  return { name, count };
});
// tagInfos => [
//   {name: "hoge", count: 3},
//   {name: "fuga", count: 2},
//   {name: "piyo", count: 1},
// ]
```

## URL 操作

Gatsby は web サイト生成ツールなので、当然、URL の文字列をいじる機会が多い。

### URL の予約文字のエスケープ

URL に使える文字は
[RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
とやらで決まっているらしい。
文字の種類としては、『reserved』と『unreserved』と『記載なしの文字』の 3 種類がある。
『reserved』と『記載なしの文字』はエスケープする必要がある。

- 『reserved』: `#` とか `$` とか
- 『unreserved』: `-` とか `.` とか
- 『記載なしの文字』: スペースとか `%` とか ASCII 制御文字とか多バイト文字( `U+80` 以降)とか

RFC3986 に加えて、Gatsby の
[createPage()](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage)
の `path` の特性も知る必要がある。
こいつは多バイト文字だけエスケープ(パーセントエンコーディング)してくれる。
(というより、「事前にパーセントエンコーディングはするな」って書いてある。)

この 2 点を考えると、 `encodeURI()` とかは使えない。
↓ の仕様を満たす関数が必要となる。

1. 『reserved』は削除
2. 『unreserved』は何もしない。
3. 『記載なしの文字』はエスケープする( `-` に置換する)。
   - ただし、多バイト文字はエスケープしない。

↑ にピッタリはまるライブラリが見つからなかったので、
[自分で作った](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/src/libs/kebab-case.js)
↓。
↑ の仕様以外に、連続するエスケープを 1 つにまとめたり、先頭と末尾の `-` を削除したり、小文字に統一したりもしてる。

```js
const kebabCase = (str) => {
  if (!str?.replace) throw new Error(`Must have a \`replace\` method.`);
  if (!str?.toLowerCase) throw new Error(`Must have a \`toLowerCase\` method.`);

  return str
    .replace(/[ !"#$%&'()*+,/:;<=>?@\[\\\]^`{|}]/g, `-`)
    .replace(/[\u0000-\u001F\u007F]/g, ``)
    .replace(/^-+|-+$/g, ``)
    .replace(/-{2,}/g, `-`)
    .toLowerCase();
};
```

ちなみに、「予約文字(非多バイト文字)をエスケープしないのはバグでは ❓」って
[issue](https://github.com/gatsbyjs/gatsby/issues/37330)
を Gatsby に出したけど、「ユーザが自分で実装すべきじゃね ❓」って言われてクローズされちゃった 😭。

### スラッシュの処理

末尾と先頭の `/` の処理は何も考えてないとバグりまくる。
↓ はやりがち。

```jsx
const path1 = `/post`;

// 別のファイルとかで別のパスを作る
const path2 = `/2022/01/`;

// また別のファイルで結合する
const fullpath = `${path1}/${path2}`;
// output => "/post//2022/01/"
// スラッシュがダブる → バグ
```

なので、 `/` をいい感じにしてくれる便利関数を作っておくと良い。
ネット上のいろんなコードを参考にして作ったのが
[これ](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/src/libs/slugify.js)
↓。

```js
const slugify = (...dirs) => {
  const validDirs = dirs.filter((dir) => dir?.toString);
  const url = validDirs.map((dir) => kebabCase(dir.toString())).join(`/`);
  return `/${url}/`.replace(/\/\/+/g, `/`);
};

slugify(`hoge/`, `/fuga`);
// output => "/hoge/fuga/"
```

### フルパスの生成

JavaScript 標準の `URL` を使うと便利かも。

```jsx
const url = new URL(`https://example.com/`);
url.pathname = `/hoge/fuga/`;
const fullPath = `${url.origin}${url.pathname}`;
// output => "https://example.com/hoge/fuga/"
```

`pathname` の先頭の `/` は無視してくれる。
が、連続した `/` や末尾の `/` は自分でケアする必要があるので注意。

`https://example.com/` の部分は `siteMetadata` から引っ張ってきて、
`pathname` の部分は `slugify()` を通したものを入れると良いかな。

## null や undefined や空配列の判断

GraphQL の挙動がぶっちゃけよく分かってなくて、
`null` だったり、 `undefined` だったり、空配列が返ってきたりする。

全部まとめて ↓ のように判断できる。

```jsx
const edges = result.data.allMarkdownPost.edges;

if (!edges?.length) {
  // エラー処理
}
```

## スプレッド構文

配列とかオブジェクトをいい感じに展開してくれるアレ。

### 配列のスプレッド構文

指定の要素ごとに記事数をカウントした配列があるとして、
それの最大値を取るには ↓ のようにする。

```js
const counts = [20, 1, 300];
const max = Math.max(...counts);
// output => 300
```

`Math.max()` は配列のまま投げても `NaN` しか返ってこない。
ので、スプレッド構文で展開して渡す必要がある。

先述の `slugify()` を使うときもスプレッド構文を使う ↓。

```jsx
const relativePath = `hoge/fuga/piyo.md`;
const { dir, name } = path.parse(relativePath);
const slug = slugify(`base`, `post`, ...dir.split(`/`), name);
// output => "/base/post/hoge/fuga/piyo/"
```

### オブジェクトのスプレッド構文

オブジェクトを展開すると、2 つのオブジェクトを簡単に結合できたりする ↓。

```js
const hoge = { a: 1, b: 2, c: 3 };
const fuga = { ...hoge, z: 99 };
// output => { a: 1, b: 2, c: 3, z: 99 }
```

`createNode()` のときによく使う。
自分流の markdown の記事用の node を作るときは ↓ のように `fieldData` を展開している。

```js
const fieldData = {
  canonicalUrl: node.frontmatter?.canonicalUrl || ``,
  date: node.frontmatter?.date ? node.frontmatter.date : "2999-01-01 00:00",
  heroImage: node.frontmatter?.heroImage,
  slug,
  tags: modifiedTags,
  title: node.frontmatter.title ? node.frontmatter.title : subdirs.slice(-1),
};

createNode({
  ...fieldData,
  // Required fields
  id: createNodeId(`${node.id} >>> MarkdownPost`),
  parent: node.id,
  children: [],
  internal: {
    type: `MarkdownPost`,
    contentDigest: createContentDigest(fieldData),
    content: JSON.stringify(fieldData),
    description: `MarkdownPost`,
  },
});
```

## 時刻操作

`Date` の API を使いこなすと良い。

`Date.prototype.getMonth()` や `Date.prototype.getFullYear()` は言うまでもないので割愛。

英語圏用に `Jan` とか `Feb` とかの文字列がほしければ
`Date.prototype.toLocaleString()` を使って ↓ のようにする。

```js
const yearMonth = new Date().toLocaleString(`en-US`, {
  year: `numeric`,
  month: `short`,
});
// output => "Feb 2023"
```

日本語にしたいときは ↓。

```js
const yearMonth = new Date().toLocaleString(`ja-JA`, {
  year: `numeric`,
  month: `short`,
});
// output => "2023年2月"
```
