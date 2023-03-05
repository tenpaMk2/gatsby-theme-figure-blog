import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";
import { SidebarItemLayout } from "./sidebar-item-layout";

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
          className="block rounded-full border border-sky-500 px-2 hover:bg-sky-400"
        >
          {name}
        </Link>
      </li>
    );
  });

  return (
    <SidebarItemLayout title="Tag cloud">
      <ol className="flex min-w-min flex-wrap items-center justify-center gap-2">
        {tagLis}
      </ol>
    </SidebarItemLayout>
  );
};
