import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";
import { getMonthName } from "../libs/get-month-name";

const ArchiveList = () => {
  const {
    allMarkdownPost: { nodes },
  } = useStaticQuery(
    graphql`
      query {
        allMarkdownPost(sort: { date: DESC }) {
          nodes {
            date(formatString: "YYYY-MM")
          }
        }
      }
    `
  );

  if (!nodes?.length) {
    return null;
  }

  const postCounts = {};
  nodes.forEach(({ date }) => {
    postCounts[date] = (postCounts[date] || 0) + 1;
  });

  const uniqueDates = Array.from(new Set(nodes.map(({ date }) => date)));

  const dateInfos = [];
  for (let i = 0; i < uniqueDates.length; i++) {
    const date = uniqueDates[i];
    const [year, month] = date.split(`-`);
    const count = postCounts[date];
    dateInfos.push({ date, year, month, count });
  }

  const uniqueYears = Array.from(new Set(dateInfos.map(({ year }) => year)))
    .sort()
    .reverse();

  const { basePath, archivesPath } = queryBlogConfig();

  const dateLis = uniqueYears.map((year) => {
    const slug = slugify(basePath, archivesPath, year);

    const infos = dateInfos.filter(({ year: x }) => x === year);

    const monthLis = infos.map(({ month, count }) => {
      const monthStr = getMonthName(month);
      const slug = slugify(basePath, archivesPath, year, month);
      return (
        <li key={slug}>
          <Link to={slug} className="group flex items-stretch justify-center">
            <p className="flex items-center rounded-l bg-slate-700 p-1 group-hover:bg-sky-600">
              {monthStr}
            </p>
            <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 py-1 px-2 group-hover:bg-sky-500">
              {count}
            </p>
          </Link>
        </li>
      );
    });

    const total = infos.reduce((acc, current) => acc + current.count, 0);

    return (
      <li
        key={slug}
        className="flex shrink basis-[1024px] flex-col items-center gap-4 border-b border-slate-500 pb-4"
      >
        <Link
          to={slug}
          className="group flex flex-none items-stretch justify-center text-2xl"
        >
          <p className="flex items-center rounded-l bg-slate-700 p-1 group-hover:bg-sky-600">
            {year}
          </p>
          <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 py-1 px-2 group-hover:bg-sky-500">
            {total}
          </p>
        </Link>
        <ol className="flex flex-wrap gap-2">{monthLis}</ol>
      </li>
    );
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-4xl">Archive list</h2>
      <ol className="flex flex-wrap gap-4 rounded-lg bg-slate-900 p-4 shadow-inner">
        {dateLis}
      </ol>
    </div>
  );
};

export default ArchiveList;
