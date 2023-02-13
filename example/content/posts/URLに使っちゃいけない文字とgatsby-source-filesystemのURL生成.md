---
date: "2022-12-22 22:43"
description: URLに使っちゃいけない文字を調べた。それらがgatsbyのURL生成にどう関係するのか検証する。
---

↓に関連。

- [MacのFinderからスラッシュが入ったファイル名を作れてしまう](/MacのFinderからスラッシュが入ったファイル名を作れてしまう/)

調べたけどすげー根が深そう。参考になりそうなのは↓。

- [URLエンコード関連メモ](https://zenn.dev/megeton/articles/5f1ba5c7e1bfd0)
- [URIに使ってよい文字の話 - RFC2396 と RFC3986 - 本当は怖いHPC](https://freak-da.hatenablog.com/entry/20080321/p1)
- [URLで使用可能な文字、使用できない文字 | iPentec](https://www.ipentec.com/document/web-url-invalid-char)

<!-- more -->

まず、仕様が新旧の2種類あるらしい。
古いのがRFC2396、新しいのがRFC3986。

新しいほうが仕様的にはより厳格でgood。
しかし、JavaScriptの `encodeURIComponent()` なんかは古い方準拠の挙動になってるらしい...。
ﾅﾝﾃｺｯﾀ。

心配してるのはgatsby-source-filesystemがファイル名から生成するURLがRFC3986に沿ってるかどうか。
沿ってないURLができちゃうとSEO的にアウトだよなぁ。多分。

適当に `?.md` とか作って試してみてるけど、挙動は様々。
404が返ってきたり、普通に表示できたり、はたまたビルド失敗したり。
`%.md` はビルド失敗した。

`(` とか `)` が痛いな。普通に使いそう。
やはり、ビルド時にチェック機構を仕込んで、エラー吐かせたほうが良いな。

## 追記: 2022/12/23

### 調査

Gatsby側の挙動を調べてみたらいろいろ分かってきた。

まず、Gatsbyで動的にページ生成する部分が
`gatsby-node.js` の `createPage()` API。
[公式docはここ。](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage)
一部抜粋↓。

> Any valid URL. Must start with a forward slash.

「変なURLは投げるなよ」って言われてるわけだ。
動作を見てても、予約語である `#` を含んだURLを投げても別にエラーにならない。
`gatsby develop` の出力にもerrorやwarningは出ない。
もちろん、 `#` は意味のある文字(URLフラグメント)なので、
`https://localhost:8000/#/` にアクセスしても `#.md` の記事が見えたりしない。

ついでに、続きも抜粋↓。

> Unicode characters should be passed directly and not encoded (eg. `á` not `%C3%A1` ).

日本語URLであってもパーセントエンコーディングするなって言ってるようだ。

まとめると、↓の仕様になってるらしい。

1. `#` とか予約語は入れるな(validなURLにしろ)
2. マルチバイト文字はそのままにしろ(パーセントエンコーディングするな)

個人的には1番を破ったらエラーぐらい吐いてほしいが、まぁそこは一旦納得することにする。

続いて、1番を守ってないURLを作ってるヤツが誰なのか調査する。
`gatsby-node.js` の `exports.createPages` の一部が↓。

```js
createPage({
  path: node.fields.slug,
  component: blogPost,
  context: {
    id: node.id,
    previousPostId: previous?.id,
    nextPostId: next?.id,
  },
})
```

`node.fields.slug` を生成してるのは `gatsby-node.js` の `exports.onCreateNode` ↓。

```js
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
```

これは自分が書いたコードじゃない。
`gatsby-starter-blog` の初期設計。

`value` を生成してるのが `gatsby-source-filesystem` の `createFilePath()` API。
[公式docはここ。](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/#createfilepath)

ファイル名に予約語がどうこうの文言はない。
困った...仕様が不明瞭だ。

[ソースはここ。](https://github.com/gatsbyjs/gatsby/blob/250c8b799a88bc07c5cef18b66dc8ebe2cd1ad9e/packages/gatsby-source-filesystem/src/create-file-path.js)
`create-file-path.js` の一部が↓。

```js
module.exports = ({
  node,
  getNode,
  basePath = `src/pages`,
  trailingSlash = true,
}) => {
  // Find the File node
  const fileNode = findFileNode({ node, getNode })
  if (!fileNode) return undefined

  const relativePath = path.posix.relative(
    slash(basePath),
    slash(fileNode.relativePath)
  )
  const { dir = ``, name } = path.parse(relativePath)
  const parsedName = name === `index` ? `` : name

  return path.posix.join(`/`, dir, parsedName, trailingSlash ? `/` : ``)
}
```

ファイルネームにURLの予約語が入ってるかどうかを気にしてる箇所はない。

まとめると、 `gatsby-source-filesystem` の `createFilePath()` の仕様次第ということになる。

- `createFilePath()` にURLの予約語を含むファイル名を投げてもOKの場合
  - `createFilePath()` の設計ミス。予約語をエスケープするなりすべき。
  - `gatsby-source-filesystem` が悪い。
- `createFilePath()` にURLの予約語を含むファイル名を投げたらNGでエラーを出す場合
  - `createFilePath()` の設計ミス。エラー吐くべき。
  - `gatsby-source-filesystem` が悪い。
- `createFilePath()` にURLの予約語を含むファイル名を投げたらNGでエラーを出さない場合
  - `onCreateNode()` の設計ミス。エラー吐くなりエスケープするなりすべき。
  - `gatsby-starter-blog` が悪い。

### 対策

`onCreateNode()` でパスのチェックして、エラー出すようにしたら良さそう。

URLに使えない文字は
[Living Standardの仕様](https://url.spec.whatwg.org/#percent-encoded-bytes)
を見ればよいか...❓
RFC3986との違いが分からん。

ついでにいうと
[MDNの解説](https://developer.mozilla.org/ja/docs/Glossary/percent-encoding)
もある。
が、Living Standardと記載に違いがある...。
バッククォートに対してパーセントエンコーディングするかどうかが違う。

- Living Standard: する
- MDN: しない

もはや何を信じたら良いんだ...。

### 公式にissue出してみた

- <https://github.com/gatsbyjs/gatsby/issues/37330>

どうなることやら。

## 追記: 2022/12/25

どの文字をパーセントエンコーディングすべきか分かってきた。

まず、困りごとは、
RFC3986とURL Living Standardのどっちが正しい仕様なのか分からんこと。

ネットでは、RFC3986が正しいと言う記事が多い。
しかし、URL Living Standardを見てると、こっちのほうが詳しく記載しているように見える。

わかりやすいのはバッククォートに関する記述。
[RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
では何も書いてないが、
[URL Living Standard](https://url.spec.whatwg.org/#query-percent-encode-set)
には記載がある。
ただし、それが何を意味してるかはよく分からない...。
パーセントエンコーディングすべきなのかどうなのか...。

という状態でネットサーフィンしてたら、
[いつものCyberLibrarianさん](https://www.asahi-net.or.jp/~ax2s-kmtn/ref/uric.html)
のページにURIで使用できる文字が一覧になってるのを見つけた。
これに着想を得て、
「Unicodeの全文字に対して何が書かれてるのか調べよう❗」となった。

調査結果が↓。おまけの調査列もある。

|     letter     |         unicode         | `encodeURIComponent()` (\*1) |  RFC2396   |  RFC3986   | URL LS "URL code points" |
| :------------: | :---------------------: | :--------------------------: | :--------: | :--------: | :----------------------: |
| ASCII 制御文字 | `U+000000` ~ `U+000020` |              ?               |     -      |     -      |            -             |
|     space      |       `U+000020`        |              O               |     -      |     -      |            -             |
|      `!`       |       `U+000021`        |              -               | unreserved |  reserved  |            O             |
|      `"`       |       `U+000022`        |              O               |     -      |     -      |            -             |
|      `#`       |       `U+000023`        |              O               |  reserved  |  reserved  |            -             |
|      `$`       |       `U+000024`        |              O               |  reserved  |  reserved  |            O             |
|      `%`       |       `U+000025`        |              O               |     -      |     -      |            -             |
|      `&`       |       `U+000026`        |              O               |  reserved  |  reserved  |            O             |
|      `'`       |       `U+000027`        |              -               | unreserved |  reserved  |            O             |
|      `(`       |       `U+000028`        |              -               | unreserved |  reserved  |            O             |
|      `)`       |       `U+000029`        |              -               | unreserved |  reserved  |            O             |
|      `*`       |       `U+00002A`        |              -               | unreserved |  reserved  |            O             |
|      `+`       |       `U+00002B`        |              O               |  reserved  |  reserved  |            O             |
|      `,`       |       `U+00002C`        |              O               |  reserved  |  reserved  |            O             |
|      `-`       |       `U+00002D`        |              -               | unreserved | unreserved |            O             |
|      `.`       |       `U+00002E`        |              -               | unreserved | unreserved |            O             |
|      `/`       |       `U+00002F`        |              O               |  reserved  |  reserved  |            O             |
|      `0`       |       `U+000030`        |              -               | unreserved | unreserved |            O             |
|      `1`       |       `U+000031`        |              -               | unreserved | unreserved |            O             |
|      `2`       |       `U+000032`        |              -               | unreserved | unreserved |            O             |
|      `3`       |       `U+000033`        |              -               | unreserved | unreserved |            O             |
|      `4`       |       `U+000034`        |              -               | unreserved | unreserved |            O             |
|      `5`       |       `U+000035`        |              -               | unreserved | unreserved |            O             |
|      `6`       |       `U+000036`        |              -               | unreserved | unreserved |            O             |
|      `7`       |       `U+000037`        |              -               | unreserved | unreserved |            O             |
|      `8`       |       `U+000038`        |              -               | unreserved | unreserved |            O             |
|      `9`       |       `U+000039`        |              -               | unreserved | unreserved |            O             |
|      `:`       |       `U+00003A`        |              O               |  reserved  |  reserved  |            O             |
|      `;`       |       `U+00003B`        |              O               |  reserved  |  reserved  |            O             |
|      `<`       |       `U+00003C`        |              O               |     -      |     -      |            -             |
|      `=`       |       `U+00003D`        |              O               |  reserved  |  reserved  |            O             |
|      `>`       |       `U+00003E`        |              O               |     -      |     -      |            -             |
|      `?`       |       `U+00003F`        |              O               |  reserved  |  reserved  |            O             |
|      `@`       |       `U+000040`        |              O               |  reserved  |  reserved  |            O             |
|      `A`       |       `U+000041`        |              -               | unreserved | unreserved |            O             |
|      `B`       |       `U+000042`        |              -               | unreserved | unreserved |            O             |
|      `C`       |       `U+000043`        |              -               | unreserved | unreserved |            O             |
|      `D`       |       `U+000044`        |              -               | unreserved | unreserved |            O             |
|      `E`       |       `U+000045`        |              -               | unreserved | unreserved |            O             |
|      `F`       |       `U+000046`        |              -               | unreserved | unreserved |            O             |
|      `G`       |       `U+000047`        |              -               | unreserved | unreserved |            O             |
|      `H`       |       `U+000048`        |              -               | unreserved | unreserved |            O             |
|      `I`       |       `U+000049`        |              -               | unreserved | unreserved |            O             |
|      `J`       |       `U+00004A`        |              -               | unreserved | unreserved |            O             |
|      `K`       |       `U+00004B`        |              -               | unreserved | unreserved |            O             |
|      `L`       |       `U+00004C`        |              -               | unreserved | unreserved |            O             |
|      `M`       |       `U+00004D`        |              -               | unreserved | unreserved |            O             |
|      `N`       |       `U+00004E`        |              -               | unreserved | unreserved |            O             |
|      `O`       |       `U+00004F`        |              -               | unreserved | unreserved |            O             |
|      `P`       |       `U+000050`        |              -               | unreserved | unreserved |            O             |
|      `Q`       |       `U+000051`        |              -               | unreserved | unreserved |            O             |
|      `R`       |       `U+000052`        |              -               | unreserved | unreserved |            O             |
|      `S`       |       `U+000053`        |              -               | unreserved | unreserved |            O             |
|      `T`       |       `U+000054`        |              -               | unreserved | unreserved |            O             |
|      `U`       |       `U+000055`        |              -               | unreserved | unreserved |            O             |
|      `V`       |       `U+000056`        |              -               | unreserved | unreserved |            O             |
|      `W`       |       `U+000057`        |              -               | unreserved | unreserved |            O             |
|      `X`       |       `U+000058`        |              -               | unreserved | unreserved |            O             |
|      `Y`       |       `U+000059`        |              -               | unreserved | unreserved |            O             |
|      `Z`       |       `U+00005A`        |              -               | unreserved | unreserved |            O             |
|      `[`       |       `U+00005B`        |              O               |  reserved  |  reserved  |            -             |
|      `\`       |       `U+00005C`        |              O               |     -      |     -      |            -             |
|      `]`       |       `U+00005D`        |              O               |  reserved  |  reserved  |            -             |
|      `^`       |       `U+00005E`        |              O               |     -      |     -      |            -             |
|      `_`       |       `U+00005F`        |              -               | unreserved | unreserved |            O             |
|    `` ` ``     |       `U+000060`        |              O               |     -      |     -      |            -             |
|      `a`       |       `U+000061`        |              -               | unreserved | unreserved |            O             |
|      `b`       |       `U+000062`        |              -               | unreserved | unreserved |            O             |
|      `c`       |       `U+000063`        |              -               | unreserved | unreserved |            O             |
|      `d`       |       `U+000064`        |              -               | unreserved | unreserved |            O             |
|      `e`       |       `U+000065`        |              -               | unreserved | unreserved |            O             |
|      `f`       |       `U+000066`        |              -               | unreserved | unreserved |            O             |
|      `g`       |       `U+000067`        |              -               | unreserved | unreserved |            O             |
|      `h`       |       `U+000068`        |              -               | unreserved | unreserved |            O             |
|      `i`       |       `U+000069`        |              -               | unreserved | unreserved |            O             |
|      `j`       |       `U+00006A`        |              -               | unreserved | unreserved |            O             |
|      `k`       |       `U+00006B`        |              -               | unreserved | unreserved |            O             |
|      `l`       |       `U+00006C`        |              -               | unreserved | unreserved |            O             |
|      `m`       |       `U+00006D`        |              -               | unreserved | unreserved |            O             |
|      `n`       |       `U+00006E`        |              -               | unreserved | unreserved |            O             |
|      `o`       |       `U+00006F`        |              -               | unreserved | unreserved |            O             |
|      `p`       |       `U+000070`        |              -               | unreserved | unreserved |            O             |
|      `q`       |       `U+000071`        |              -               | unreserved | unreserved |            O             |
|      `r`       |       `U+000072`        |              -               | unreserved | unreserved |            O             |
|      `s`       |       `U+000073`        |              -               | unreserved | unreserved |            O             |
|      `t`       |       `U+000074`        |              -               | unreserved | unreserved |            O             |
|      `u`       |       `U+000075`        |              -               | unreserved | unreserved |            O             |
|      `v`       |       `U+000076`        |              -               | unreserved | unreserved |            O             |
|      `w`       |       `U+000077`        |              -               | unreserved | unreserved |            O             |
|      `x`       |       `U+000078`        |              -               | unreserved | unreserved |            O             |
|      `y`       |       `U+000079`        |              -               | unreserved | unreserved |            O             |
|      `z`       |       `U+00007A`        |              -               | unreserved | unreserved |            O             |
|      `{`       |       `U+00007B`        |              O               |     -      |     -      |            -             |
|      `\|`      |       `U+00007C`        |              O               |     -      |     -      |            -             |
|      `}`       |       `U+00007D`        |              O               |     -      |     -      |            -             |
|      `~`       |       `U+00007E`        |              -               | unreserved | unreserved |            O             |
|      DEL       |       `U+00007F`        |              ?               |     -      |     -      |            -             |
|      特殊      | `U+000080` ~ `U+0000A0` |              ?               |     -      |     -      |            -             |
|    それ以降    | `U+0000A1` ~ `U+10FFFF` |              ?               |     -      |     -      |          O(\*2)          |

- (\*1): パーセントエンコーディングされてれば `O` とする。 `?` は未調査。
- (\*2): ただし、サロゲートと非文字( `U+10FFFF` とか)は除く

左から順に列を解説する。

`letter` 列と `unicode` 列は見たとおり。

`encodeURIComponent()` 列はおまけ列。
JSの `encodeURIComponent()` にその文字を投げたとき、
パーセントエンコーディングされるかどうかを示す。
Node.jsで実際に確認した結果を記載。

`RFC2396` 列と `RFC3986` 列は各仕様でその文字がどういう扱いになっているかを示す。
`RFC2396` 列はおまけ列。

`URL LS "URL code points"` 列はURL Living Standarの
"URL code points" の対象になっているかを示す。

ここから考察。

まず、分かることとしては、
`RFC3986` 列には `reserved` と `unreserved` の他に
記載なし( `-` )があること。
`` ` `` 以外に、 `>` や `<` もある。

つまり、 `reserved` と `unreserved` って字面で勘違いしてたけど、
**ASCII文字全部を二分して書いてあるわけじゃない** のね。
記載なしって第三カテゴリが存在してる。

ここで `URL LS "URL code points"` 列を見ると、
`RFC3986` 列で記載ありのものだけ、記載がある( `O` )のが分かる。
ただし、 `U+0000A1` 以上は `RFC3986` に記載なし。

原文の文脈をもうちょっと読んでみると、どうやら
URL(の一部)の文字列として有効な文字を列挙してるようだ。
だから、予約語( `RFC3986` で `reserved` )にも `O` がつく。

ついでに、 `U+0000A1` 以上の文字で
Living Standard側にだけ `O` がつく理由も分かった。
Living Standardはパーセントエンコーディングをデコードした文字を想定してる。
デコード前は `%E6%97%A5%E6%9C%AC%E8%AA%9E` とかなので、ASCIIになる。
`RFC3986` はデコード前のASCIIの世界で話をしてるのだろう。

なお、chromeのURL欄は **一部を除き** デコード後の文字列を表示しているようだ。
すっごい紛らわしいので注意。
`日本　語` (全角スペース入)を含んだURLにアクセスすると、
`日本%E3%80%80語` という表示になる。
しかし、デバッガで見てみると、
`%E6%97%A5%E6%9C%AC%E3%80%80%E8%AA%9E` になっている。
`%E6%97%A5` ( `日` )と
`%E6%9C%AC` ( `本` )と
`%E8%AA%9E` ( `語` )だけがデコードされて、
`%E3%80%80` (全角スペース)はデコードされてないことが分かる。
また、このことからもURLの実体はASCIIであり、
UTF-8ではないことが分かる。

以上を総合的に考えると、
パーセントエンコーディングすべき文字は
`RFC3986` 列で `reserved` と `-` になってる文字ということになる。
`reserved` はURLで特殊な意味を持つ文字になるので、
記事URLとして使うと意図した結果にならない(ただの文字とは思ってもらえない)。
`-` はそもそも想定してない文字なので、使っちゃいかん。

ここからおまけ。

JavaScriptの `encodeURIComponent()` が
古い方の規格である `RFC2396` に準拠してるとの噂があった。
確かめた結果も↑の表に載せてある。

確かに `RFC2396` の `reserved` と `-` だけ
`encodeURIComponent()` でパーセントエンコーディングされてることが分かる。
