---
date: "2023-01-14 22:32"
tags:
  - プログラミング
  - Gatsby
---

`onCreateNode()` や `createPages()` なんかの引数のAPI仕様がよく分からんかった。

なかなか適切なキーワードが見つからなくて苦労した。

別の捜し物をしているうちに
[公式 Doc](https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/)
をようやく見つけた。

> The first argument passed to each of Gatsby’s Node APIs is an object containing a set of helpers. Helpers shared by all Gatsby’s Node APIs are documented in Shared helpers section.
>
> ```js
> // in gatsby-node.js
> exports.createPages = (gatsbyNodeHelpers) => {
>   const { actions, reporter } = gatsbyNodeHelpers;
>   // use helpers
> };
> ```

"Node API Helpers" で探せば良かったっぽい。分かるかんなもん ❗

ちなみに、 `actions` については
[別ページ](https://www.gatsbyjs.com/docs/reference/config-files/actions/)
を見ること。

> Gatsby uses Redux internally to manage state. When you implement a Gatsby API, you are passed a collection of actions (equivalent to actions bound with bindActionCreators in Redux) which you can use to manipulate state on your site.
>
> The object `actions` contains the functions and these can be individually extracted by using ES6 object destructuring.
>
> ```js
> // For function createNodeField
> exports.onCreateNode = ({ node, getNode, actions }) => {
>   const { createNodeField } = actions;
> };
> ```

なんだか難しいことが書いてあるが、
要は「状況に応じて使うべきか変わるような関数は `actions` に入れておいたぜ ❗」って理解すれば良さそう。
