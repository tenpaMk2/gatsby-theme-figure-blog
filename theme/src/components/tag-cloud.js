import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";

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

  const allTags = nodes
    ?.map(({ tags }) => tags)
    .flat()
    .filter((tag) => tag); // remove `null` that is no tag in the post.

  if (!allTags) {
    return (
      <div>
        <p>No tags❗</p>
      </div>
    );
  }

  const postCounts = {};
  allTags.forEach(({ name }) => {
    postCounts[name] = (postCounts[name] || 0) + 1;
  });

  console.log(`tag-name and post-counts.`);
  console.table(postCounts);

  const uniqueTagNames = Array.from(
    new Set(allTags.map(({ name }) => name))
  ).filter((x) => x);
  const uniqueTagSlugs = Array.from(
    new Set(allTags.map(({ slug }) => slug))
  ).filter((x) => x);

  if (uniqueTagNames.length !== uniqueTagSlugs.length) {
    console.table({ uniqueTagNames });
    console.table({ uniqueTagSlugs });
    return new Error(
      `Unique tag-names length and unique tag-slugs length are not match. Maybe there are orthographic variants?`
    );
  }

  // make unique tag info.
  const tagInfos = [];
  for (let i = 0; i < uniqueTagNames.length; i++) {
    const name = uniqueTagNames[i];
    const slug = uniqueTagSlugs[i];
    const count = postCounts[name];
    tagInfos.push({ name, slug, count });
  }
  console.log(`tag info.`);
  console.table(tagInfos);

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
      <li
        key={slug}
        className={`rounded bg-slate-700 hover:bg-sky-600 ${textSize}`}
      >
        <Link
          to={slugify(basePath, tagsPath, slug)}
          className="baseline flex justify-center"
        >
          <p className="h-full flex-auto p-1 text-right">{name}</p>
          <p className="h-full flex-auto border-l border-slate-800 py-1 px-2 text-left">
            {count}
          </p>
        </Link>
      </li>
    );
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-4xl">tag cloud</h2>
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {tagLis}
      </ol>
    </div>
  );
};

export default TagCloud;
