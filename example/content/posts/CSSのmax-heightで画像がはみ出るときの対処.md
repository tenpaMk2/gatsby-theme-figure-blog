---
date: "2023-01-28 22:27"
tags:
  - プログラミング
  - CSS
  - React
  - Tailwind CSS
---

flexとか使ってカード状のレイアウトをしていて↓のようになってしまった。

![css_max-height_image_overflow_ng](./images/css_max-height_image_overflow_ng.png)

画像がはみ出てしまっている。
期待していたのは↓。

![css_max-height_image_overflow_ok](./images/css_max-height_image_overflow_ok.png)

この問題を解決する方法をメモっておく。

<!-- more -->

まず、前提環境はReact(もっというとGatsby)とTailwind CSS。
Tailwind CSSを知らない人は `className` の値でググって、
Vanilla CSSだとどうなるか読み解いてね。

NGのときのカードコンポーネントのjsxが↓(関係ないプロパティは削ってる)。
↓のreturnを受ける親要素がFlexboxになってると思って。

```jsx
return (
  <article className="max-h-96 grow basis-[14rem]">
    <header>
      <h1>Title</h1>
      <time>2023/01/28 22:13</time>
    </header>
    <section>
      <GatsbyImage image={image} alt="hero image" />
    </section>
  </article>
);
```

Gatsby 知らない人は `<GatsbyImage>` が `<div>` で囲まれた `<img>` になると思って。

↓ のようにすれば解決。

```jsx
return (
  <article className="grow basis-[14rem]">
    <header>
      <h1>Title</h1>
      <time>2023/01/28</time>
    </header>
    <section>
      <GatsbyImage image={image} alt="hero image" className="max-h-96" />
    </section>
  </article>
);
```

要は `max-h-96` (Vanilla CSS では `max-height: 24rem` )を
Flex Items じゃなくて、中身の `<img>` (Gatsby Image の場合には wrapper の `<div>` )に
指定すれば良い。

## 解説

なんだか当たり前の話を長々と書いてる気がするので注意。

NG のコードを書いてるときの頭は、
「Flex Items って横幅の伸び方を `flex-grow` とかで指定するんだし、
高さだって Flex Items に指定するでしょ ❗」
というもの。これが間違いだった。

そもそも、HTML&CSS において、
親要素の高さというのは子要素の高さ分だけ必要になるもの。
それを無理矢理制限したら、子要素がはみ出るのは当たり前。

まぁ、10 行の文章を子要素に持つ親要素が 5 行分の高さしかなかったら、
残りの 5 行ははみ出るよね。当たり前。

なので、親要素の高さを制限する場合、選択肢は 2 つ ↓。

1. 親要素に `height` or `max-height` を指定して、はみ出た子要素は無視したり、スクロール表示させる( `overflow` プロパティを指定する)
2. 子要素を縮小したり、削る

今回の場合は 1 番は適さない。
子要素である画像が見切れるのはアウトだし、スクロールさせるのは違うよね。

ので、2 番が適切。
タイトルや日付などの文章は縮小できないので、画像のほうを縮小する。

以上より、OK のコードに繋がる。
