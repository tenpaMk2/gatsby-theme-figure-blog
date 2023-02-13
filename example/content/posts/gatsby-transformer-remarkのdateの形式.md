---
date: "2023-02-12 00:39"
tags:
  - プログラミング
  - GraphQL
  - Gatsby
---

dateの形式は実は結構ややこしいのでメモ。

<!-- more -->

gatsby-transformer-remark の readme には残念ながら記載なし。

おそらく、JavaScript の `Date()` に食わせてると思ったので、これの引数の形式を調べることに。

こっちは
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#date_string)
に正式な解答があった。

> A string value representing a date, in a format recognized by the `Date.parse()` method. (The ECMA262 spec specifies a simplified version of ISO 8601, but other formats can be implementation-defined, which commonly include IETF-compliant RFC 2822 timestamps.)

[simplified version of ISO 8601](https://tc39.es/ecma262/#sec-date-time-string-format)
というのが正式な規格らしい。
よく見る `YYYY-MM-DDTHH:mm:ss.sssZ` ってやつ。

これ以外に、実装依存で別の形式も受け付けるとのこと。

`YYYY-MM-DDTHH:mm:ss.sssZ` は直感的じゃないのと、入力が手間なのであまり使いたくない。
`YYYY-MM-DD HH:mm` でも Gatsby は受け付けてくれるっぽいので、これを採用。

`YYYY-MM-DD` は GoogleIME で『きょう』で変換すれば出るし、
`HH:mm` も同様に『いま』で変換すれば出るので、入力しやすい。

秒は無視して OK。1 秒を争う記事は書かんよ 😎

## ハマりポイントその 1

`YYYY/MM/DD` **は受け付けてくれない** 。
Node.js(v19.2.0)で `new Date("2023/02/11")` とすると受け付けてくれるが、
Gatsby ではだめなようだ...。

厳密には、Gatsby でも一見受け付けてくれるように見える。が、これがクセモノ。
`formatString` を指定して query したり、
`filter` に `date` を指定して query したりすると ↓、

```graphql
query MyQuery {
  allMarkdownRemark(
    filter: { frontmatter: { date: { lt: "2023-02-12 22:26:59" } } }
    sort: { frontmatter: { date: DESC } }
  ) {
    nodes {
      frontmatter {
        date
      }
    }
  }
}
```

ここで初めてエラーを吐く ↓。

```json
{
  "errors": [
    {
      "message": "Field \"lt\" is not defined by type \"StringQueryOperatorInput\".",
      "locations": [
        {
          "line": 3,
          "column": 35
        }
      ]
    }
  ]
}
```

どうやら日付としてではなく、ただの文字列として認識しちゃってるようだ。
なので、 `lt` の指定ができなくてエラーを吐く。

## ハマりポイントその 2

他にありがちなのは、時分秒のうち、時を 1 桁にしちゃってもエラーになる。
まさしくこの記事を書いててやらかしてるんだけど、
`2023-02-12 0:39` は NG。
`2023-02-12 00:39` は OK。

その 1 同様に、これも特定の query をするまで、エラーが見えないのが厄介。

## ハマりポイントその 3

filter 側も `YYYY-MM-DD` じゃないとだめ。
**しかもこっちはエラーすら吐かない** 。

↓ の query では `YYYY/MM/DD` になっており、エラーを吐かないが、期待した動作にはならない。

```graphql
query MyQuery {
  allMarkdownRemark(
    filter: { frontmatter: { date: { lt: "2023/02/12" } } }
    sort: { frontmatter: { date: DESC } }
  ) {
    nodes {
      frontmatter {
        date
      }
    }
  }
}
```

query 結果の傾向を見てると、↑ の場合は `2024` 年未満の記事が query されるようだ。
2023/02/11 の記事はもちろん、2023/12/31 の記事も query されちゃう。ﾅﾝｼﾞｬｿﾘｬ。

## 対策

ブログ記事用の template で `date` に `formatString` を指定して query するようにして、

```jsx
export const postQuery = graphql`
  query ($id: String!, $formatString: String) {
    current: markdownPost(id: { eq: $id }) {
      date(formatString: $formatString)
    }
  }
`;
```

コンポーネント側で `"Invalid date"` だったらエラーに落とすようにしたら良い。

```jsx
if (date === `Invalid date`) {
  throw new Error(
    [
      `Invalid date!!`,
      `Don't use the \`/\`  as separator.`,
      `e.g., ❌: \`2023/02/11 09:12\` => ⭕: \`2023-02-11 09:12\` .`,
      `Set the hour to 2 digits,`,
      `e.g., ❌: \`2023-02-11 9:12\` => ⭕: \`2023-02-11 09:12\` .`,
    ].join(` `)
  );
}
```

エラーに落とすと、画面にデカデカとポップアップ表示されるので、これで見逃さない。

## 余談

本当はページアクセス時じゃなくて、
ビルド時にエラーに落としたいんだけど、方法が分からなかった...。

gatsby-transformer-remark が parser を公開してれば良かったんだけど、そんなもんない。

ならばと、`gatsby-node.js` で query する作戦に切り替えたが、これも仕様上無理そうだった。

残念。
