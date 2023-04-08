---
date: 2023-01-14 23:53:00+9
tags:
  - Gatsby
  - GraphQL
  - Font
---

GraphQLエディタ( `http://localhost:8000/___graphql` )は
Fira Codeフォントを使っている。

`a !== b.md` などを表示させると↓のように `≠` みたいなレンダリング結果になる。

![fira-code_in_graph-ql_1](./images/fira-code_in_graph-ql_1.png)

意図せず変な表示に見えることがある↓。

![fira-code_in_graph-ql_2](./images/fira-code_in_graph-ql_2.png)

元の文は `ver.-` のピリオドだが、 `・` (中点)みたいに見える。

このときは、 `kebabCase()` の設計実装をしたばっかだったから、
てっきりそっちのバグかと思って焦った...。
