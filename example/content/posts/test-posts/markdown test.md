---
tags:
  - プログラミング
  - markdown
---

Markdown test post.

<!-- more -->

## heading\#\#

### heading\#\#\#

#### heading\#\#\#\#

##### heading\#\#\#\#\#

###### heading\#\#\#\#\#\#

- hyphen-list1
- hyphen-list2
- hyphen-list3

1. number list
2. number list
3. number list

- _em_
- **strong**

1. nested list
   - hoge
   - fuga
2. nested list
   1. foo
   2. bar
3. 3 is best
   - a
     - b
       - c
4. 4 is Guido Mista
   - very long long long long long long long long long long long long long long long long long long long long long long long long long long long long text.
   - not very short short short short short short short short short short short short short short short short short short short short short short short short text.
   - multi
     line
     list.

[google link](https://www.google.com/)

| left align | center align | right align |
| :--------- | :----------: | ----------: |
| left       |    center    |       right |

monospace font check.

```markdown
| left align |  中央  | right align |
| :--------- | :----: | ----------: |
| 012345     | center |       right |
| 一二三     | center |          右 |
```

`inline code` , `日本語インラインコード` .

English
breakline.

日本語
改行(スペースが入るかな?)。

code block.

```ts
import { Actor, Canvas, CollisionType, Engine, Vector } from "excalibur";

console.log("日本語やで");

export class PowerGauge extends Actor {
  getProgressCallback: (() => number) | null = null;

  constructor() {
    super({
      pos: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
    });
    this.z = 1;
  }

  onPreUpdate(_engine: Engine, _delta: number): void {
    const canvas = new Canvas({
      cache: false,
      height: 32,
      width: 32,
      draw: (ctx: CanvasRenderingContext2D) => {
        if (!this.getProgressCallback)
          throw Error("Have not registered getProgress callback!!");

        ctx.strokeStyle = "chartreuse";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2 * this.getProgressCallback(), false);
        ctx.stroke();
      },
    });
    this.graphics.use(canvas);
  }

  registerGetProgressCallback(callback: () => number) {
    this.getProgressCallback = callback;
  }
}
```

quote block.

> ## Required: Pick a PrismJS theme or create your own
>
> PrismJS ships with a number of themes (previewable on the PrismJS website) that you can easily include in your Gatsby site, or you can build your own by copying and modifying an example (which is what we’ve done for gatsbyjs.com).
>
> paragraph2.
>
> ## second heading ninja
>
> AIEEEE!!

引用ブロック.

> ## 引用ヘッダー
>
> 引用本文。
>
> - 引用箇条書き
> - 引用箇条書き
> - 引用箇条書き
>
> 引用本文 2。
>
> ## 引用ヘッダー 2 ニンジャ
>
> アイエエエエ! ニンジャ!? ニンジャナンデ!?

end.
