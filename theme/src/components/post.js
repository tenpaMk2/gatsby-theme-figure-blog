import { Link } from "gatsby";
import * as React from "react";

const Post = ({ title, date, html, tags }) => {
  const tagLis = tags.map((tag) => (
    <li>
      <Link to={tag.slug}>{tag.name}</Link>
    </li>
  ));

  const tagOl = tagLis?.length ? <ol>{tagLis}</ol> : null;

  return (
    <article
      className="prose prose-invert m-8 w-full max-w-none rounded-xl bg-slate-700 p-8"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline mb-0">{title}</h1>
        <time datetime={date}>{date}</time>
        <hr className="my-2 border border-slate-500" />
      </header>
      <section
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
      />
      <footer>
        <hr className="border border-slate-500" />
        {tagOl}
      </footer>
    </article>
  );
};

export default Post;
