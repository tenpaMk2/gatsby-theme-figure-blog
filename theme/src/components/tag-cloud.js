import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";
import { extractTagInfosFromPosts } from "../libs/extract-tag-infos-from-markdown-posts";

const TagCloud = () => {
  const {
    allMarkdownPost: { nodes },
  } = useStaticQuery(
    graphql`
      query {
        allMarkdownPost {
          nodes {
            tags {
              name
              slug
            }
          }
        }
      }
    `
  );

  const tagInfos = extractTagInfosFromPosts(nodes);

  if (!tagInfos) {
    return (
      <div>
        <p>No tags❗</p>
      </div>
    );
  }

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
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-4xl">tag cloud</h2>
      <ol className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-slate-900 p-2 shadow-inner">
        {tagLis}
      </ol>
    </div>
  );
};

export default TagCloud;
