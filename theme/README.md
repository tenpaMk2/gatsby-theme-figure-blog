# @tenpamk2/gatsby-theme-figure-blog

![example-1](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/example-1.png)

[日本語READMEはこちら。](https://github.com/tenpaMk2/gatsby-theme-figure-blog/tree/main/theme)

The blogging theme that is suitable for Bishoujo Figure photographs.
You can start your own bishoujo figure review blog right now❗

## Demo

[View demo!!](https://gatsby-starter-figure-blog.netlify.app/)

## My blog

[tenpaMk2's blog](https://tenpamk2-blog.netlify.app/)

## Features

- Make your photos look as large as possible.
- Responsive
- Hero image
  - If it's portrait, focus (crop) on the top side. Since the figure's face is often there❗
- Generate post title from filename
- Pure Markdown not MDX
- [Special hooks](#special-hooks)
- Code highlighting by [Prism.js](https://prismjs.com/)
- Dark mode only
- Tags, archives pages
- Cards layout support in tags and archives page
- Pagination
- Debug page
- Tailwind CSS
- Partial locale support by `Intl`

## Installation

```sh
npm install @tenpamk2/gatsby-theme-figure-blog
```

This theme use Tailwind CSS, so you need to set up plugin options and create the some file.
You don't need to install each package since this theme specifies them as dependencies.

Enable PostCSS plugin.

```js
  plugins: [
    "gatsby-plugin-postcss",
  ]
```

Create `postcss.config.js` in the top directory of your project.

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `tailwind.config.js` in the top directory of your project.
Change the `content` options as you like.

```js
const defaultOptions = require(`@tenpamk2/gatsby-theme-figure-blog/tailwind.config.js`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...defaultOptions,
  ...{
    content: [
      ...defaultOptions.content,
      `./src/**/*.{js,jsx,mjs,ts,tsx}` // Change this as you like.
    ],
  },
};
```

Create `src/styles/global.css` .

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add `import` in `gatsby-browser.js` .

```js
import "./src/styles/global.css";
```

It's over❗

### Install as a starter

```sh
npx gatsby new gatsby-starter-figure-blog https://github.com/tenpaMk2/gatsby-starter-figure-blog
```

[View the starter's code.](https://github.com/tenpaMk2/gatsby-starter-figure-blog)

## Not supported

### RSS Feed

This theme does not generate RSS feed.
Use [gatsby-plugin-feed](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/) .

This theme provides posts information ( `MarkdownPost` nodes ) by GraphQL.
It has helpful fields for RSS ( `rssContentEncoded` and `rssDescription` ).
They can be used in `gatsby-plugin-feed` options as follows.

```js
{
  // See [gatsby-plugin-feed doc](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/) .
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
      {
        site {
          siteMetadata {
            # All fields are pass through as \`feedOptions\` .
            title # This is overwritten by \`title\` of \`feeds\` .
            description
            siteUrl
            site_url: siteUrl
          }
        }
      }
    `,
    feeds: [
      {
        serialize: ({ query: { site, allMarkdownPost } }) =>
          allMarkdownPost.nodes.map(
            ({ date, rssContentEncoded, rssDescription, slug, title }) => ({
              date,
              title,
              description: rssDescription,
              url: new URL(slug, site.siteMetadata.siteUrl).href, // Unlike Gatsby, URL must be percent-encoded in RSS.
              custom_elements: [{ "content:encoded": rssContentEncoded }],
            })
          ),
        query: `
          {
            allMarkdownPost(limit: 20, sort: {date: DESC}) {
              nodes {
                date
                rssContentEncoded
                rssDescription
                slug
                title
              }
            }
          }
        `,
        output: "/rss.xml",
        title: "Your site's RSS feed | All",
      },
    ],
  },
},
```

### Favicons

This theme does not generate favicons and insert `<link rel="icon">` tags.
Use [gatsby-plugin-manifest](https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/) .

### Google analytics

This theme does not embed gtag.
Use [gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/) .

### Comment section in posts

This theme does not have comment section.

## Special hooks

Some Markdown under special conditions are converted to special components.

### Post link cards of internal links

Convert an internal link to a post-link-card.
The card has hero-image of linked post (or page), so looks so good❗

For example, when you write the following Markdown,

```md
Link card test.

[Portrait test](/test-posts/hero-image-portrait-1/)
```

you will get the following post-link-card.

![post-link-card-example](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/post-link-card.png);

This hook works under the following conditions.

- The link is internal-link, not external-link.
- The link is at the top level.
  - For example, the link in the blockquote does not converted.
- The link is the only element in the paragraph.
  - For example, the link on the next line of text will not be converted.
- The link is not an image link.

### Image compare slider

Convert 2 images to image-compare-slider
by [react-compare-slider](https://github.com/nerdyman/react-compare-slider) .
This is very helpful when you want to show interactive compare slider for your site visitors❗

For example, when you write the following Markdown,

```md
![Focus on Miyu](../images/compare-left.jpg "left")
![Focus on Chloe](../images/compare-right.jpg "right")
```

you will get the following image-compare-slider.

![image-compare-slider](https://raw.githubusercontent.com/tenpaMk2/gatsby-theme-figure-blog/main/theme/images/image-compare-slider.png);

This hook works under the following conditions.

- The title of images starts with `left` or `right` .
- Both images are at the top level.
- Both images are in the same paragraph.
  - This means that you cannot insert blank lines between both images in Markdown.

## Usage

### `siteMetadata`

| Key                | example                               | Description                                    |
| :----------------- | :------------------------------------ | :--------------------------------------------- |
| `title`            | `'My Blog'`                           | Title of your blog.                            |
| `description`      | `'The blog about japanese figure!!'`  | Description of your blog.                      |
| `siteUrl`          | `'https://your-blog.com'`             | Origin of your blog. Do not end with `/` .     |
| `author.name`      | `'your name'`                         | Author name. This is shown in bio sidebar.     |
| `author.summary`   | `'I'm a software engineer in Japan.'` | Author summary. This is shown in bio sidebar.  |
| `social.twitter`   | `'@youraccount'`                      | Twitter acount. Leave it `''` if not needed.   |
| `social.instagram` | `'your_account'`                      | Instagram acount. Leave it `''` if not needed. |
| `social.github`    | `'yourAccount'`                       | GitHub acount. Leave it `''` if not needed.    |
| `menuLinks`        | `[...]`                               | Menu links in nav-bar at top in header.        |
| `menuLinks[].name` | `'About'`                             | Link text.                                     |
| `menuLinks[].link` | `'/about/'`                           | Link.                                          |

### Theme options

| Key                              | Default Value                                                                                                      | Description                                                                                                                                             |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `archivesPath`                   | `'archives'`                                                                                                       | URL for the archives pages.                                                                                                                             |
| `basePath`                       | `'base'`                                                                                                           | Root url for the theme.                                                                                                                                 |
| `cardsPerPage`                   | `12`                                                                                                               | The number of cards in 1 page.                                                                                                                          |
| `debugPath`                      | `'debug'`                                                                                                          | URL for the debug page.                                                                                                                                 |
| `descriptionPrunedLength`        | `128`                                                                                                              | The prune length of description (excerpt).                                                                                                              |
| `descriptionTruncate`            | `false`                                                                                                            | Truncate texts of the description.                                                                                                                      |
| `externalLinks`                  | `[]`                                                                                                               | External link lists info for sidebar.                                                                                                                   |
| `externalLinks[].name`           | -                                                                                                                  | External link text.                                                                                                                                     |
| `externalLinks[].url`            | -                                                                                                                  | External link.                                                                                                                                          |
| `intlYear`                       | `{ year: 'numeric' }`                                                                                              | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) options for year.           |
| `intlYearAndMonth`               | `{ year: 'numeric', month: 'short' }`                                                                              | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) options for year and month. |
| `intlMonth`                      | `{ month: 'short' }`                                                                                               | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) options for month.          |
| `intlMonthAndDate`               | `{ month: 'short', day: 'numeric'}`                                                                                | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) options for month and date. |
| `intlTime`                       | `{ timeStyle: 'short', hour12: false}`                                                                             | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) options for time.           |
| `locale`                         | `'en-US'`                                                                                                          | Locale.See [MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) .                                           |
| `pagesPath`                      | `'pages'`                                                                                                          | URL for the pagination after 2nd pages.                                                                                                                 |
| `postPath`                       | `'post'`                                                                                                           | URL for the post page.                                                                                                                                  |
| `postsPerPage`                   | `6`                                                                                                                | The number of posts in 1 page at main page.                                                                                                             |
| `rssNeedFullContent`             | `false`                                                                                                            | Contain full content into the field of `MarkdownPost.rssContentEncoded` for RSS.                                                                        |
| `rssPruneLength`                 | `128`                                                                                                              | The prune length of the field of `MarkdownPost.rssDescription` for RSS.                                                                                 |
| `rssTruncate`                    | `false`                                                                                                            | Truncate texts of the field of `MarkdownPost.rssContentEncoded` and `MarkdownPost.rssDescription` for RSS.                                              |
| `tagsPath`                       | `'tags'`                                                                                                           | URL for the tags page.                                                                                                                                  |
| `options***`                     | -                                                                                                                  | Plugin options. Do not set unless you understand what you are doing.                                                                                    |
| `optionsGatsbyRemarkImages`      | (See [gatsby-config.mjs](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/gatsby-config.mjs) ) | `gatsby-remark-images` options. You can change image quality , `max-width` or etcetc.                                                                   |
| `optionsGatsbyTransformerRemark` | (See [gatsby-config.mjs](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/gatsby-config.mjs) ) | `gatsby-transformer-remark` options. You can change `excerpt_separator` .                                                                               |

### MarkdownPost and MarkdownPage

You can create 2 types page from Markdown.

MarkdownPost page is for a post page.
You can create it by placing your markdown in the following directory.

- `content/posts/post-title.md`
  - URL: `/post-title/`
- `content/posts/your/post/title/index.md`
  - URL: `/your/post/title/`

MarkdownPage page is for a static page.
You can create it by placing your markdown in the following directory.

- `content/pages/page-title.md`
  - URL: `/page-title/`
- `content/pages/your/page/title/index.md`
  - URL: `/your/page/title/`

### Frontmatter

All keys of frontmatter are optional.

| Key            | MarkdownPost | MarkdownPage | Description                                                               |
| :------------- | :----------: | :----------: | :------------------------------------------------------------------------ |
| `slug`         |      O       |      O       | Root relative URL of the page. If omitted, it is determined by file path. |
| `title`        |      O       |      O       | Page title. If omitted, it is determined by filename.                     |
| `canonicalUrl` |      O       |      O       | Canonical URL (absolute URL). If omitted, it is determined by `slug` .    |
| `heroImage`    |      O       |      O       | Relative path to hero image. If omitted, default no-image image is used.  |
| `heroImageAlt` |      O       |      O       | Alt text for hero image.                                                  |
| `isNSFW`       |      O       |      O       | If it's `true` , the post is rated as adult content for Google.           |
| `tags`         |      O       |      -       | **Array** of tags.                                                        |
| `date`         |      O       |      -       | Date. YAML date format is recommended such as `2023-04-01 23:30:00+9` .   |

### Example usage

See [gatsby-config.mjs of example](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/example/gatsby-config.mjs)
or Markdowns.

### Change header image

Place your image at `static/header.webp` .

### Change bio image

Place your image at `src/@tenpamk2/gatsby-theme-figure-blog/images/bio.svg` .
Or, you can do
[shadowing](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/)
by creating a customized `bio-icon.js` and placing it at `src/@tenpamk2/gatsby-theme-figure-blog/components/bio-icon.js` .

### Change placeholder image(no-image image)

Place your image at `src/@tenpamk2/gatsby-theme-figure-blog/images/no-image.png` .
Resolution should be 800 x 450.

If you want to use other resolution,
shadow the `seo.js` and change the resolution settings for OGP.

```js
import noImage from "../images/no-image.png";
const Seo = ({
  // ...
  image: {
    src: imageSrc,
    width: imageWidth,
    height: imageHeight,
    alt: imageAlt,
  } = {
    src: noImage,
    width: 800,
    height: 450,
    alt: `no image`,
  },
  // ...
}) => {
 // ...
}
```

### Change code syntax highlight theme

Import your favorite Prism.js theme in `gatsby-browser.js` .

```js
// See [gatsby-remark-prismjs](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/) .
import "prismjs/themes/prism-tomorrow.css";
```

### Change Markdown style

This theme uses [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) for Markdown styling.

If you want to change the style, override `typography` option in your `tailwind.config.js` .
See [`tailwind.config.js` of this theme](https://github.com/tenpaMk2/gatsby-theme-figure-blog/blob/main/theme/tailwind.config.js)

## Credits

|            Item             | Link                                                                           |
| :-------------------------: | :----------------------------------------------------------------------------- |
| Magnifying Glass SVG Vector | [Icooon Mono in SVG Repo](https://www.svgrepo.com/svg/479944/magnifying-glass) |
|  Twitter Boxed SVG Vector   | [instructure-ui in SVG Repo](https://www.svgrepo.com/svg/501411/twitter-boxed) |
|      Github SVG Vector      | [scarlab in SVG Repo](https://www.svgrepo.com/svg/508076/github)               |
|    Instagram SVG Vector     | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/497210/instagram)            |
|       Menu SVG Vector       | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/497274/menu)                 |
|   Close Circle SVG Vector   | [Iconsax in SVG Repo](https://www.svgrepo.com/svg/496952/close-circle)         |
