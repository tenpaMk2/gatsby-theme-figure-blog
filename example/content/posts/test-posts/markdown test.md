---
tags:
  - プログラミング
  - Markdown
---

Markdown test post.

<!-- more -->

## Heading

```markdown
## Heading\#\#
```

↓.

## Heading\#\#

```markdown
### Heading\#\#\#
```

↓.

### Heading\#\#\#

```markdown
#### Heading\#\#\#\#
```

↓.

#### Heading\#\#\#\#

```markdown
##### Heading\#\#\#\#\#
```

↓.

##### Heading\#\#\#\#\#

```markdown
###### Heading\#\#\#\#\#\#
```

↓.

###### Heading\#\#\#\#\#\#

## Bullet lists

```markdown
- hyphen-list1
- hyphen-list2
  - nested
    - nested
- hyphen-list3
```

↓.

- hyphen-list1
- hyphen-list2
  - nested
    - nested
- hyphen-list3

## Number lists

```markdown
1. number list
2. number list
   1. nested
      1. nested
3. number list
```

↓.

1. number list
2. number list
   1. nested
      1. nested
3. number list

## Mix lists

```markdown
1. number list
   - bullet list
   - bullet -list
2. number list
   1. number list
   2. number list
3. number list
   - bullet
     1. number
   - bullet
4. Guido Mista
   - very long long long long long long long long long long long long long long long long long long long long long long long long long long long long text.
   - not very short short short short short short short short short short short short short short short short short short short short short short short short text.
   - multi
     line
     list.
```

↓ .

1. number list
   - bullet list
   - bullet -list
2. number list
   1. number list
   2. number list
3. number list
   - bullet
     1. number
   - bullet
4. Guido Mista
   - very long long long long long long long long long long long long long long long long long long long long long long long long long long long long text.
   - not very short short short short short short short short short short short short short short short short short short short short short short short short text.
   - multi
     line
     list.

## Emphasis

```markdown
_em_ .

**strong** .

**_Super Saiyan_** .
```

↓ .

_em_ .

**strong** .

**_Super Saiyan_** .

## Link

```markdown
[google link](https://www.google.com/)

[space link](https://www.example.com/you%20need%20to%20escape)
```

↓ .

[google link](https://www.google.com/)

[space link](https://www.example.com/you%20need%20to%20escape)

## Table

```markdown
| left align | center align | right align |
| :--------- | :----------: | ----------: |
| left       |    center    |       right |
| left       |    center    |       right |
| left       |    center    |       right |
```

↓ .

| left align | center align | right align |
| :--------- | :----------: | ----------: |
| left       |    center    |       right |
| left       |    center    |       right |
| left       |    center    |       right |

```markdown
| Column1 | Column2 | Column3 | Column4 | Column5 | Column6 | Column7 | Column8 | Column9 | Column10 | Column11 | Column12 | Column13 |
| :------ | :-----: | ------: | :------ | :------ | :------ | :------ | :------ | :------ | :------- | :------- | :------- | :------- |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |
```

↓ .

| Column1 | Column2 | Column3 | Column4 | Column5 | Column6 | Column7 | Column8 | Column9 | Column10 | Column11 | Column12 | Column13 |
| :------ | :-----: | ------: | :------ | :------ | :------ | :------ | :------ | :------ | :------- | :------- | :------- | :------- |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |
| left    | center  |   right | left    | left    | left    | left    | left    | left    | left     | left     | left     | left     |

## Code Block

````markdown
```js
const longlong = `very long long long long long long long long long long long long long long long long long long long long long long long long long text.`;
```
````

↓

```js
const longlong = `very long long long long long long long long long long long long long long long long long long long long long long long long long text.`;
```

````markdown
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
````

↓ .

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

````markdown
```markdown
| left align |  中央  | right align |
| :--------- | :----: | ----------: |
| 012345     | center |       right |
| 一二三     | center |          右 |
```
````

↓ .

```markdown
| left align |  中央  | right align |
| :--------- | :----: | ----------: |
| 012345     | center |       right |
| 一二三     | center |          右 |
```

## Inline code

```markdown
- `inline code` .
- `日本語インラインコード` 。
```

- `inline code` .
- `日本語インラインコード` 。

## Break line

```markdown
English
breakline.
```

↓ .

English
breakline.

```markdown
日本語
改行(スペースが入るかな?)。
```

↓ .

日本語
改行(スペースが入るかな?)。

## Quote block

````markdown
> ## First heading
>
> Some long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long texts.
>
> paragraph2.
>
> - A: `inline code` .
> - B: `日本語インライン` .
>
> ```js
> const foo = `bar`.
> console.table({foo});
> ```
>
> ## 2番目のヘディング
>
> アイエエエエ! ニンジャ!? ニンジャナンデ!?
>
> > 「アイエエエ！？」「ニンジャ！？ニンジャナンデ！？」「コワイ！」「ゴボボーッ！」明け方を迎えようとする飲み屋の酔漢達は恐怖のあまり容易に失禁し、嘔吐した。
> > それらへ侮蔑的な視線を送りながら朱色のニンジャは手近のオチョコを掴むと中のサケをイッキし、壁に投げつけて割った。
>
> （第2部「キョート殺伐都市」:「ウェルカム・トゥ・ネオサイタマ」#2exitより）
````

↓ .

> ## First heading
>
> Some long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long texts.
>
> paragraph2.
>
> - A: `inline code` .
> - B: `日本語インライン` .
>
> ```js
> const foo = `bar`.
> console.table({foo});
> ```
>
> ## 2番目のヘディング
>
> アイエエエエ! ニンジャ!? ニンジャナンデ!?
>
> > 「アイエエエ！？」「ニンジャ！？ニンジャナンデ！？」「コワイ！」「ゴボボーッ！」明け方を迎えようとする飲み屋の酔漢達は恐怖のあまり容易に失禁し、嘔吐した。
> > それらへ侮蔑的な視線を送りながら朱色のニンジャは手近のオチョコを掴むと中のサケをイッキし、壁に投げつけて割った。
>
> （第2部「キョート殺伐都市」:「ウェルカム・トゥ・ネオサイタマ」#2exitより）

## Horizontal Rules

```markdown
Sand

---

Wich
```

↓ .

Sand

---

Wich

## HTML

```markdown
<p>Do not forget to buy <mark>milk</mark> today.</p>
```

<p>Do not forget to buy <mark>milk</mark> today.</p>
