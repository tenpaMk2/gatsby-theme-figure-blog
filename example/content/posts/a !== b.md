---
title: a !== b
date: "2023-01-14 23:53"
tags:
  - Gatsby
---

GraphQL エディタ( `http://localhost:8000/___graphql` )は
Fira Code フォントを使っている。

`a !== b.md` などを表示させると、↓ のように `≠` みたいなレンダリング結果になる。

![fira-code_in_graph-ql_1](./images/fira-code_in_graph-ql_1.png)

ちなみに発端は ↓ の画面。

![fira-code_in_graph-ql_2](./images/fira-code_in_graph-ql_2.png)

`ver.-` のピリオドが `・` (中点)みたいに見える。

`kebabCase()` の設計実装をしたばっかだったから、
てっきりそっちのバグかと思って焦った...。
