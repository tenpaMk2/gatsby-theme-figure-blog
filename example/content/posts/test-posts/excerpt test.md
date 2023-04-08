---
date: 2023-01-09 21:38:00+9
tags:
  - プログラミング
  - Markdown
  - Gatsby
---

いろはにほへとちりぬるを一。
いろはにほへとちりぬるを二。
いろはにほへとちりぬるを三。
いろはにほへとちりぬるを四。
いろはにほへとちりぬるを五。
いろはにほへとちりぬるを六。
いろはにほへとちりぬるを七。
いろはにほへとちりぬるを八。
いろはにほへとちりぬるを九。
いろはにほへとちりぬるを十。

いろはにほへとちりぬるを一。
いろはにほへとちりぬるを二。
いろはにほへとちりぬるを三。
いろはにほへとちりぬるを四。
いろはにほへとちりぬるを五。
いろはにほへとちりぬるを六。
いろはにほへとちりぬるを七。
いろはにほへとちりぬるを八。
いろはにほへとちりぬるを九。
いろはにほへとちりぬるを十。

`excerpt` の生成範囲より後に英文があっても影響しない。

↓のqueryをなげると、

```graphql
query MyQuery {
  allMarkdownRemark {
    nodes {
      excerpt
    }
  }
}
```

↓のように `"…"` が返ってきてしまう。

```json
{
  "data": {
    "allMarkdownRemark": {
      "nodes": [
        {
          "excerpt": "…"
        }
      ]
    }
  },
  "extensions": {}
}
```

2023/01/15 追記:
[公式 Doc](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/#excerpts-for-non-latin-languages)
によると、 `excerpt(truncate = true)` にすれば良いらしい。
