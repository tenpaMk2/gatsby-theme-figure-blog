---
title: Tailwind CSSで意味のあるカラー名などはつけないほうが良い
date: "2023-02-05 22:01"
tags:
  - プログラミング
  - Tailwind CSS
---

って公式が言ってた。

[公式 doc](https://tailwindcss.com/docs/customizing-colors#naming-your-colors)

> Tailwind uses literal color names (like red, green, etc.) and a numeric scale (where 50 is light and 900 is dark) by default. We think this is the best choice for most projects, and have found it easier to maintain than using abstract names like `primary` or `danger`.

つまり、『メイン色』とか『サブカラー』って意味合いの名前はつけないほうが良いとのこと。

もちろん、さらに抽象化した『背景色』とか『ボタン色』とかも NG。

[Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
も読むと理解が深まるかも。
抽象化が悪と言っているように見える。
普段のプログラミングとは脳みそを逆に使わないといけないみたいでおもしろい。

とはいえ、デザインとしては統一したいので、
コードとは別に、『メインカラーは\*\*\*で、サブカラーは\*\*\*〜』って決めておいたほうが良いな。
