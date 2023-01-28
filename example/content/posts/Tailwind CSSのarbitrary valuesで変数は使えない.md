---
title: Tailwind CSSのarbitrary valuesで変数は使えない
date: "2023-01-28 18:09"
tags:
  - プログラミング
  - Gatsby
  - Tailwind CSS
---

↓ みたいなことをしても期待通りには動作しない。

```jsx
const x = 3;
return <article className={`basis-[${x}rem]`} />;
```

公式 doc の記述は見つからなかったが、
[Stack Overflow](https://stackoverflow.com/questions/70584680/problem-with-arbitrary-values-on-tailwind-with-react)
にそれっぽいことが書いてあった。

> This is wrong:
>
> ```jsx
> <div class="text-{{ error ? 'red' : 'green' }}-600"></div>
> ```
>
> Instead use Complete class names:
>
> ```jsx
> <div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
> ```

実際の動作でも、
変数を使った場合と、
変数を使わずに変数の値と全く同じ class name を直接書いた場合とで動作が違った。
