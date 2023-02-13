---
date: "2023-02-11 18:31"
tags:
  - プログラミング
  - JavaScript
  - React
---

Reactってattributesは基本的にlowerCamelCaseになってる。
例えば↓。

- `datetime` → `dateTime`
- `stroke-width` → `strokeWidth`

ただし、例外があって、それが `aria-*` と `data-*` なんだそうな。

[React公式doc](https://reactjs.org/docs/accessibility.html#wai-aria)
に書いてある。

> Note that all `aria-*` HTML attributes are fully supported in JSX. Whereas most DOM properties and attributes in React are camelCased, these attributes should be hyphen-cased (also known as kebab-case, lisp-case, etc) as they are in plain HTML:

[DOM Elements](https://reactjs.org/docs/dom-elements.html)
にも書いてある。

> In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute `tabindex` corresponds to the attribute `tabIndex` in React. The exception is `aria-*` and `data-*` attributes, which should be lowercased. For example, you can keep `aria-label` as `aria-label`.

なんでこんなことになってるかは不明。
[Stack Overflow](https://stackoverflow.com/questions/52398380/why-react-wai-aria-is-not-in-camelcase)
にも同じこと聞いてる人がいたが、推測しか載ってなかった。深く読んでない。
