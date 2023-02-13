---
date: "2023-01-15 00:59"
tags:
  - プログラミング
  - Gatsby
---

GraphQL の型定義をするときは、
`gatsby-node.js` の `createSchemaCustomization()` にて ↓ のようにする。

```js
const typeDefs = `
    type MarkdownPost implements Node {
      title: String!
      slug: String!
      date: Date! @dateformat
      excerpt(pruneLength: Int = 140): String!
      canonicalUrl: String
    }
  `;
createTypes(typeDefs);
```

この `excerpt` の `pruneLength` は
オプション(呼び方が分からん)であり、
`Int` が型であり、
`= 140` がデフォルト値。

~~[公式 Doc はこちら](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#creating-custom-extensions)~~

> ~~Note that in the above example, there have been additional provided configuration options with `args` . This is e.g. useful to provide default field arguments:~~
>
> ```js
> exports.createSchemaCustomization = ({ actions }) => {
>   actions.createTypes(`
>     type BlogPost implements Node {
>       content: String @md(sanitize: false)
>     }
>   `);
> };
> ```

あ、これ違う記述のような ❓
でも実動作を見てると、デフォルト値の決め方としては間違ってなさそう。
