import { Link } from "gatsby";
import * as React from "react";

const Post = ({ title, date, html, slug, tags, needReadMore = false }) => {
  const tagLis = tags.map(({ name, slug }) => (
    <li key={slug}>
      <Link to={slug} className="underline">
        {name}
      </Link>
    </li>
  ));

  const tagOl = tagLis?.length ? (
    <ol className="flex flex-wrap gap-4">{tagLis}</ol>
  ) : null;

  const readMore = needReadMore ? (
    <p className="text-xl">
      <Link to={slug} className="underline">
        →Read More
      </Link>
    </p>
  ) : null;

  return (
    <article
      className="w-full rounded-xl bg-slate-700 p-8"
      itemScope
      itemType="http://schema.org/Article"
    >
      <section className="prose prose-invert max-w-none">
        <header>
          <h1 itemProp="headline" className="mb-2">
            <Link to={slug} className="no-underline">
              {title}
            </Link>
          </h1>
          <time datetime={date}>{date}</time>
          <hr className="my-2 border border-slate-500" />
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: html }}
          itemProp="articleBody"
        />
      </section>
      {readMore}
      <footer>
        <hr className="my-2 border border-slate-500" />
        {tagOl}
      </footer>
    </article>
  );
};

export default Post;
