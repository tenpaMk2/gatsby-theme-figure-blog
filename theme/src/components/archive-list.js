import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";

const ArchiveList = () => {
  const {
    postsInfo: { yearInfos, yearMonthInfos },
  } = useStaticQuery(
    graphql`
      query {
        postsInfo {
          yearInfos {
            count
            yearNumber
            yearString
          }
          yearMonthInfos {
            count
            monthNumber
            monthString
            yearNumber
            yearString
          }
        }
      }
    `
  );

  const { basePath, archivesPath } = queryBlogConfig();

  const dateLis = yearInfos.map(
    ({ yearNumber, yearString, count: yearCount }) => {
      const monthInfos = yearMonthInfos.filter(
        ({ yearNumber: y }) => y === yearNumber
      );
      const monthLis = monthInfos.map(
        ({ monthNumber, monthString, count: monthCount }) => {
          const slug = slugify(
            basePath,
            archivesPath,
            yearNumber,
            monthNumber + 1
          );
          return (
            <li key={slug}>
              <Link
                to={slug}
                className="group flex items-stretch justify-center"
              >
                <p className="flex items-center rounded-l bg-slate-700 p-1 group-hover:bg-sky-600">
                  {monthString}
                </p>
                <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 py-1 px-2 group-hover:bg-sky-500">
                  {monthCount}
                </p>
              </Link>
            </li>
          );
        }
      );

      const slug = slugify(basePath, archivesPath, yearNumber);
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
              {yearString}
            </p>
            <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 py-1 px-2 group-hover:bg-sky-500">
              {yearCount}
            </p>
          </Link>
          <ol className="flex flex-wrap gap-2">{monthLis}</ol>
        </li>
      );
    }
  );

  return (
    <div className="flex basis-full flex-wrap content-start gap-4">
      <h2 className="basis-full text-4xl">Archive list</h2>
      <ol className="flex basis-full flex-wrap gap-4 rounded-lg bg-slate-900 p-4 shadow-inner">
        {dateLis}
      </ol>
    </div>
  );
};

export default ArchiveList;
