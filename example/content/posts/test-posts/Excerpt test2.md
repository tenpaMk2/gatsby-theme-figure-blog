---
date: 2023-04-11 22:30:00+9
tags:
  - プログラミング
  - Markdown
  - Gatsby
---

`excerpt` の生成範囲より後に英文があっても影響しない。

<!--descriptionで無視される?-->

アイエエエエ⁉

| hoge     | fuga         |
| :------- | :----------- |
| テーブル | は           |
| どう     | 見えるかな❓ |

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
