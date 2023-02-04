import { Link } from "gatsby";
import * as React from "react";

const Post = ({ title, date, html, slug, tags, isPostPage }) => {
  const tagLis = tags?.map(({ name, slug }) => (
    <li key={slug}>
      <Link to={slug} className="underline">
        {name}
      </Link>
    </li>
  ));

  const tagOl = tagLis?.length ? (
    <ol className="flex flex-wrap gap-4">{tagLis}</ol>
  ) : null;

  const readMore = isPostPage ? null : (
    <p className="my-4 text-xl">
      <Link
        to={slug}
        className="flex w-max items-center rounded bg-sky-500 p-3 font-semibold leading-none text-white hover:bg-sky-400"
      >
        →Read More
      </Link>
    </p>
  );

  const h1 = isPostPage ? (
    <h1 itemProp="headline" className="mb-2">
      {title}
    </h1>
  ) : (
    <h1 itemProp="headline" className="mb-2">
      <Link to={slug} className="no-underline">
        {title}
      </Link>
    </h1>
  );

  return (
    <article
      className="w-full rounded-xl bg-slate-700 p-8"
      itemScope
      itemType="http://schema.org/Article"
    >
      <section className="prose prose-invert max-w-none">
        <header>
          {h1}
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
