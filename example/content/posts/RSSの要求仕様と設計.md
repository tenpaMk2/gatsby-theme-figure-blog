---
date: 2023-03-08 23:09:00+9
tags:
  - RSS
  - Feedly
  - プログラミング
---

RSSをどうすべきか考える。

<!-- more -->

## 基礎知識: RSS

改めて説明しようとすると意外と言語化できなかった。

[株式会社アーティスさん](https://www.asobou.co.jp/blog/life/rss-2)
の説明がGoogleのトップヒットでわかりやすい。

> RSSとは「Really Simple Syndication」、または「Rich Site Summary」の略語※で、Webサイトのニュースやブログなどの、更新情報の日付やタイトル、その内容の要約などを配信するため技術のことです。RSSは、XML形式で記述されており、RSSリーダーと呼ばれるツールを使用することで、様々なサイトの更新情報や新着情報を自動的に取得することができます。
>
> つまり、RSSリーダーにお気に入りのWebサイトのRSSを登録することで、わざわざお気に入りのサイトへアクセスしなくても、更新情報や新着情報をチェックすることができます。

あと、規格が複数あって、AtomだのRSS2だのがあるらしい。
ぶっちゃけよく分からん。まぁ、Gatsbyの流儀に任せてれば大丈夫だろう。多分。

## 基礎知識: 公式Doc類

まず見るべきものが↓。

- [GatsbyのRSS追加方法の公式Doc](https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-an-rss-feed/)
- [gatsby-plugin-feedの公式Doc](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/)
- [npmのrss package](https://www.npmjs.com/package/rss)

## 基礎知識: XML

RSSのXMLは大まかに分けて↓の2種類で構成される。

1. 冒頭部分: サイト全体の説明やRSSそのものの説明
2. 記事部分: 記事ごとの説明

1番については公式Doc見て。
あまりいじれなさそうだし、いじる必要もなさそう。

問題は2番。
こっちはカスタマイズ性が高くて、悩みどころ。

記事1つ1つが `<item>` タグに相当する。
おそらくほぼ最小構成で↓の状態。

```xml
<item>
  <title><![CDATA[Iframe test]]></title>
  <description><![CDATA[🚧WIP🚧 ]]></description>
  <link>https://tenpamk2-blog.netlify.app/test-posts/iframe-test/</link>
  <guid isPermaLink="true">https://tenpamk2-blog.netlify.app/test-posts/iframe-test/</guid>
  <pubDate>Mon, 31 Dec 2998 15:00:00 GMT</pubDate>
  <content:encoded>&lt;p&gt;🚧WIP🚧&lt;/p&gt;
&lt;ul&gt;
&lt;li&gt;YouTube&lt;/li&gt;
&lt;li&gt;Twitter&lt;/li&gt;
&lt;li&gt;Post card? (Convert post links to post cards.)&lt;/li&gt;
&lt;/ul&gt;</content:encoded>
</item>
```

`<title>` は記事タイトル。 `CDATA` とやらを使ってるのは謎。
多分、HTMLじゃなくてテキストを期待してる気がする。

`<description>` は記事の要約。
`<title>` 同様にテキストを期待か。
HTMLを書けないので、
要約範囲内にコードブロックとか引用ブロックがある場合は取り扱い注意。

`<link>` は記事のURL。
パーセントエンコーディングされてる必要があるので注意。

`<guid>` はユニークID。
慣例的に記事のURLを使うらしい。
`isPermaLink` は謎。pluginにおまかせする。

`<pubDate>` は記事公開日。
未来の日付になってると、W3Cのfeed validatorでWarningが出るので注意。
日付のテキスト形式はよー分からん...。pluginにおまかせする。

`<content:encoded>` がHTMLをテキストとしてエンコードしたもの。
RSSリーダーで記事表示するとき用のデータっぽい。

`<content:encoded>` は記事全文を入れることもあるらしい。
ただ、そうしちゃうとサイトのアクセス数が減っちゃうので、
あくまで要約に留める、というのも作戦のひとつ。

リンクは相対パスはNG。絶対パスじゃないとだめ。
`style` 属性でも使えるものと使えないものがある。
`position: absolute` とかだめ。

## 要求仕様: XML

↓に対応。

- `<title>`
- `<description>`
- `<link>`
- `<guid>`
- `<pubDate>`
- `<content:encoded>`

`<description>` は記事要約をテキストにしたものにする。
ただし、↓は無視する(含めない)。含めると文章として破綻するため。

- 箇条書き
- コードブロック
- 表

また、↓は適当な文字で囲んで区別つくようにする。

- インラインコード: `` ` `` で囲む
- 引用ブロック: `「` と `」` で囲む

`<content:encoded>` は記事要約をHTMLにしたものにする。
ただし、Gatsby Themeとしては要約だけじゃなくて、フル記事にも対応できるようにしとく。

**HTMLはReact環境下じゃなくても成り立つものにする** 。

よって、 `gatsby-transformer-remark` が作った画像系のタグは必要最小限に間引いておく。
特に、placeholder用の画像は削除しないとRSSリーダの表示がおかしくなる...はず。

`<picture>` と、その下にぶら下がる `<source>` 類は一応残す。
が、なんか弊害出たら `<img>` だけ残そう。

`style` 属性は
[W3Cが許可してるもの](https://validator.w3.org/feed/docs/warning/DangerousStyleAttr.html)
だけ残して後は削除。

## 要求仕様: Hero image

Hero imageは表示する。
Feedlyで表示されればOKにする。

## 設計: Hero image

RSS中のHero imageを実現する一般的な方法論は見当たらず。

Feedlyに限れば、
[公式Doc](https://blog.feedly.com/10-ways-to-optimize-your-feed-for-feedly/)
に記載があった。

> If the feed is partial, the Feedly poller will look up in the web page and see if the webpage includes open graph or Twitter card metadata and use that as the featured visual.

つまり、 `<description>` だけだったり、 `<content:encoded>` に `<img>` がなかったりしたら、
OGやTwitter cardのデータを読みとってくれるらしい。

実際、
[Analographicsさん](https://analographics.net/)
のFeedはFeedlyで画像表示されるが、RSSは↓のようになっている。

```xml
<item>
  <title>フィギュアレビュー:ネオンマックス Mois</title>
  <link>https://analographics.net/archives/16031</link>
  <comments>https://analographics.net/archives/16031#respond</comments>
  <dc:creator><![CDATA[difeet]]></dc:creator>
  <pubDate>Fri, 17 Feb 2023 10:59:52 +0000</pubDate>
  <category><![CDATA[フィギュアレビュー]]></category>
  <category><![CDATA[その他メーカー]]></category>
  <guid isPermaLink="false">https://analographics.net/?p=16031</guid>
  <description><![CDATA[wfの傷(筋肉痛)も癒えてきた今日この頃。 difeetだね。 さて、今回はNEON MAXさんより発売された「Mois」ちゃんのレビューをお届けするよ。 ちなみにMoisで&#8221;モイス&#8221;と読んでしま [&#8230;]]]></description>
  <wfw:commentRss>https://analographics.net/archives/16031/feed</wfw:commentRss>
  <slash:comments>0</slash:comments>
</item>
```

どこにも `<img>` はない。

記事URLの `<meta>` を見てみると、 `og:image` と `twitter:image` があった。
Feedlyはこれをもとに画像表示してるんだろう。

## 詳細設計

ソースコード見て。
