---
title: gatsbyのStaticImageとTailwind CSSを同時に使う
date: "2023-01-19 22:31"
tags:
  - Gatsby
  - Tailwind CSS
  - プログラミング
---

ブログのヘッダ画像を定義するときに ↓ のようにした。

```jsx
<StaticImage
  src="../images/header.jpg"
  alt="header image"
  // See [gatsby-plugin-image doc](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#layout)
  layout="fullWidth"
  className="h-48"
/>
```

基本方針としては、 `<StaticImage>` が持ってるプロパティは優先的に使う。
その後、Tailwind 側でフォローする。

ちなみに、↑ の jsx は ↓ の html になる。

```html
<div data-gatsby-image-wrapper="" class="gatsby-image-wrapper h-48" style="">
  <div aria-hidden="true" style="padding-top:56.25%"></div>
  <div
    aria-hidden="true"
    data-placeholder-image=""
    style="opacity: 0; transition: opacity 500ms linear 0s; background-color: rgb(8, 8, 8); position: absolute; inset: 0px; object-fit: cover;"
  ></div>
  <picture
    ><source
      type="image/webp"
      srcset="
        /static/ca67439c110092f3457ae78ecaeb460f/a66aa/header.webp  750w,
        /static/ca67439c110092f3457ae78ecaeb460f/65dd5/header.webp 1080w,
        /static/ca67439c110092f3457ae78ecaeb460f/4fad6/header.webp 1366w,
        /static/ca67439c110092f3457ae78ecaeb460f/c512e/header.webp 1920w
      "
      sizes="100vw" />
    <img
      layout="fullWidth"
      width="1"
      height="0.5625"
      data-main-image=""
      style="object-fit: cover; opacity: 1;"
      sizes="100vw"
      decoding="async"
      loading="lazy"
      src="/static/ca67439c110092f3457ae78ecaeb460f/a764f/header.jpg"
      srcset="
        /static/ca67439c110092f3457ae78ecaeb460f/37bba/header.jpg  750w,
        /static/ca67439c110092f3457ae78ecaeb460f/61c72/header.jpg 1080w,
        /static/ca67439c110092f3457ae78ecaeb460f/d61e8/header.jpg 1366w,
        /static/ca67439c110092f3457ae78ecaeb460f/a764f/header.jpg 1920w
      "
      alt="header image" /></picture
  ><noscript
    ><picture
      ><source
        type="image/webp"
        srcset="
          /static/ca67439c110092f3457ae78ecaeb460f/a66aa/header.webp  750w,
          /static/ca67439c110092f3457ae78ecaeb460f/65dd5/header.webp 1080w,
          /static/ca67439c110092f3457ae78ecaeb460f/4fad6/header.webp 1366w,
          /static/ca67439c110092f3457ae78ecaeb460f/c512e/header.webp 1920w
        "
        sizes="100vw" />
      <img
        layout="fullWidth"
        width="1"
        height="0.5625"
        data-main-image=""
        style="object-fit:cover;opacity:0"
        sizes="100vw"
        decoding="async"
        loading="lazy"
        src="/static/ca67439c110092f3457ae78ecaeb460f/a764f/header.jpg"
        srcset="
          /static/ca67439c110092f3457ae78ecaeb460f/37bba/header.jpg  750w,
          /static/ca67439c110092f3457ae78ecaeb460f/61c72/header.jpg 1080w,
          /static/ca67439c110092f3457ae78ecaeb460f/d61e8/header.jpg 1366w,
          /static/ca67439c110092f3457ae78ecaeb460f/a764f/header.jpg 1920w
        "
        alt="header image" /></picture
  ></noscript>
</div>
```

1 番目と 2 番目の空の `div` はなんなんだろう...謎。
