---
date: "2023-02-05 22:44"
tags:
  - プログラミング
  - Tailwind CSS
---

[公式doc](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)
に記載があった。

> When you need to style an element based on the state of some parent element, mark the parent with the `group` class, and use `group-*` modifiers like `group-hover` to style the target element:
>
> ```jsx
> <a href="#" class="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500">
>   <div class="flex items-center space-x-3">
>     <svg class="h-6 w-6 stroke-sky-500 group-hover:stroke-white" fill="none" viewBox="0 0 24 24"><!-- ... --></svg>
>     <h3 class="text-slate-900 group-hover:text-white text-sm font-semibold">New project</h3>
>   </div>
>   <p class="text-slate-500 group-hover:text-white text-sm">Create a new project from a variety of starting templates.</p>
> </a>
> ```

全体をまとめるタグに `group` を使って、
連動してホバーさせたいタグに `group-hover` を使えば良いらしい。

↑の例の通り、直接の親子関係じゃなくても良いらしい。
