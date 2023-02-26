import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";

export const TagCloud = () => {
  const {
    postsInfo: { tagInfos },
  } = useStaticQuery(
    graphql`
      query {
        postsInfo {
          tagInfos {
            count
            name
            slug
          }
        }
      }
    `
  );

  const counts = tagInfos.map(({ count }) => count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);

  const { basePath, tagsPath } = queryBlogConfig();

  const tagLis = tagInfos.map(({ name, slug, count }) => {
    const textSizes = [``, `text-lg`, `text-2xl`, `text-3xl`, `text-4xl`];
    const textSize =
      textSizes[
        Math.floor((count - min) / ((max - min + 1) / textSizes.length))
      ];

    return (
      <li key={slug} className={`group ${textSize}`}>
        <Link
          to={slugify(basePath, tagsPath, slug)}
          className="flex items-stretch justify-center"
        >
          <p className="flex items-center rounded-l bg-slate-700 p-1 group-hover:bg-sky-600">
            {name}
          </p>
          <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 py-1 px-2 group-hover:bg-sky-500">
            {count}
          </p>
        </Link>
      </li>
    );
  });

  return (
    <div className="flex min-w-0 basis-full flex-wrap content-start gap-4">
      <h1 className="basis-full overflow-x-auto py-1 text-xl md:text-4xl">
        Tag cloud
      </h1>
      <div className="basis-full overflow-x-auto">
        <ol className="flex min-w-min flex-wrap items-center justify-center gap-2 rounded-lg bg-slate-900 p-4 shadow-inner">
          {tagLis}
        </ol>
      </div>
    </div>
  );
};
