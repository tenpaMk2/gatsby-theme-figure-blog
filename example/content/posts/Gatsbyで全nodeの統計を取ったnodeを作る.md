---
date: 2023-02-09 22:17:00+9
tags:
  - プログラミング
  - Gatsby
  - JavaScript
---

Markdownで書いた全記事の統計情報を扱うnodeをGraphQLで作りたい。

記事1つに対して処理したいなら、 `onCreateNode()` であれこれすれば良いが、
全記事(複数 node)となると話が別。

<!-- more -->

ググったら Gatsby の issues↓ がヒット。

- [Can I create nodes based on a graphql query?](https://github.com/gatsbyjs/gatsby/issues/11760#issuecomment-463601260)

> It's not possible because graphql schema doesn't exist yet. But you have some programmatic access to already existing nodes through some functions passed to our node APIs:
>
> ```js
> export const sourceNodes = ({
>   actions,
>   createNodeId,
>   createContentDigest,
>   getNode,
>   getNodes,
>   getNodesByType,
> }) => {
>   const singleNodeById = getNode("some-id");
>   const arrayOfAllTheNodes = getNodes();
>   const arrayOfNodesOfGivenType = getNodesByType("some_type");
>   // do some programmatic with those nodes
> };
> ```

`sourceNodes()` であれこれ処理すれば良いらしい。

一応、
[公式 doc](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#sourceNodes)
も確認 ↓。

> Extension point to tell plugins to source nodes. This API is called during the Gatsby bootstrap sequence. Source plugins use this hook to create nodes. This API is called exactly once per plugin (and once for your site’s `gatsby-config.js` file). If you define this hook in `gatsby-node.js` it will be called exactly once after all of your source plugins have finished creating nodes.

ビルドの中で 1 回だけコールされるらしい。これなら良さそう。

`getNodesByType()` で `MarkdownRemark` で記事を拾ってきて、
統計取って、 `createNode()` で node を作るだけ。

ここから本ブログの実例。

まずは前提となる GraphQL の型定義が ↓。

```graphql
type MarkdownPost implements Node {
  canonicalUrl: String
  date: Date! @dateformat
  excerpt(
    pruneLength: Int = 140
    truncate: Boolean = true
    format: MarkdownExcerptFormats = HTML
  ): String! @markdownpassthrough(fieldName: "excerpt")
  heroImage: File @fileByRelativePath
  html: String! @markdownpassthrough(fieldName: "html")
  slug: String!
  tags: [PostTag]
  title: String!
}

type PostTag {
  name: String
  slug: String
}
```

ここから `sourceNodes()` 。
関係あるところだけ抜粋してある。
順に解説。

まずは `getNodesByType()` で markdown 記事の node を集めてくる。

```js
exports.sourceNodes = (
  { actions, createContentDigest, getNodesByType, reporter },
  themeOptions
) => {
  const { createNode } = actions;

  const posts = getNodesByType(`MarkdownPost`);

...
```

タグごとの記事数の情報( `tagInfos` )を生成 ↓。

```js
const allTags = posts
  ?.map(({ tags }) => tags)
  .flat()
  .filter((tag) => tag);
const allTagNames = allTags.map(({ name }) => name);
const tagInfos = [...new Set(allTagNames)].map((name) => {
  const filtered = allTags.filter(({ name: n }) => n === name);
  const count = filtered.length;
  const slug = filtered[0].slug;

  return { name, count, slug };
});
```

`Set` を使って重複削除したタグ名を生成。
それに対して `map()` することで、タグ名ごとに情報整理する。
記事数は `filter()` と `length` で拾ってくる。

続いて、年月ごとの記事数を集計 ↓(年ごとの記事数はこれを利用して後で生成する)。

```js
const allYearMonths = posts.map(
  ({ date }) =>
    new Date(date).toLocaleString(`en-US`, {
      year: `numeric`,
      month: `short`,
    })
);
const yearMonthInfos = [...new Set(allYearMonths)].map((yearMonth) => {
  const count = allYearMonths.filter((ym) => ym === yearMonth).length;
  const d = new Date(yearMonth);
  const year = d.toLocaleString(`en-US`, { year: `numeric` });
  const month = d.toLocaleString(`en-US`, { month: `short` });

  return { yearMonth, count, year, month };
});
```

原理はタグのときとだいたい一緒。
年月は別々に扱いたいときもあるので、
`yearMonth` だけじゃなくて `year` と `month` も突っ込んでおく。

続いて、年ごとの記事数を集計 ↓。

```js
const allYears = yearMonthInfos.map(({ year }) => year);
const yearInfos = [...new Set(allYears)].map((year) => {
  const infos = yearMonthInfos.filter(({ year: y }) => y === year);
  const count = infos.reduce((total, { count }) => total + count, 0);

  return { year, count };
});
```

すでに作っておいた年月の情報をもとに生成する。

最後に、 `createNode()` する ↓。

```js
  const postsInfo = { tagInfos, yearInfos, yearMonthInfos };

  createNode({
    ...postsInfo,
    id: `@tenpamk2/gatsby-theme-figure-blog-posts-info`,
    parent: null,
    children: [],
    internal: {
      type: `PostsInfo`,
      contentDigest: createContentDigest(postsInfo),
      content: JSON.stringify(postsInfo),
      description: `Posts info for @tenpamk2/gatsby-theme-figure-blog`,
    },
  });
};
```
