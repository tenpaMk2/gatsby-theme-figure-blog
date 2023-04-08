import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { queryBlogConfig } from "../libs/query-blog-config";
import { slugify } from "../libs/slugify";
import { SidebarItemLayout } from "./sidebar-item-layout";

const LinkButton = ({ slug, str, count }) => (
  <Link to={slug} className="group flex items-stretch justify-center">
    <p className="flex items-center rounded-l bg-slate-700 p-1 group-hover:bg-sky-400">
      {str}
    </p>
    <p className="flex items-center rounded-r border-l border-slate-800 bg-gray-600 px-2 py-1 group-hover:bg-sky-400">
      {count}
    </p>
  </Link>
);

export const ArchiveList = () => {
  const {
    postsInfo: { yearInfos, yearMonthInfos },
  } = useStaticQuery(
    graphql`
      query {
        postsInfo {
          yearInfos {
            count
            yearNumber
          }
          yearMonthInfos {
            count
            monthNumber
            yearNumber
          }
        }
      }
    `
  );

  const { archivesPath, basePath, intlMonth, intlYear, locale } =
    queryBlogConfig();

  const dateLis = yearInfos.map(({ yearNumber, count: yearCount }) => {
    const monthInfos = yearMonthInfos.filter(
      ({ yearNumber: y }) => y === yearNumber
    );

    const monthLis = monthInfos.map(({ monthNumber, count: monthCount }) => {
      const slug = slugify(
        basePath,
        archivesPath,
        yearNumber,
        (monthNumber + 1).toString().padStart(2, `0`)
      );

      const monthString = new Intl.DateTimeFormat(locale, intlMonth).format(
        new Date(yearNumber, monthNumber)
      );

      return (
        <li key={slug}>
          <LinkButton slug={slug} str={monthString} count={monthCount} />
        </li>
      );
    });

    const slug = slugify(
      basePath,
      archivesPath,
      yearNumber.toString().padStart(4, `0`)
    );

    const yearString = new Intl.DateTimeFormat(locale, intlYear).format(
      new Date(yearNumber, 0)
    );

    return (
      <li
        key={slug}
        className="flex flex-col items-center gap-4 border-b border-slate-500 pb-4"
      >
        <div className="flex justify-center">
          <LinkButton slug={slug} str={yearString} count={yearCount} />
        </div>
        <ol className="flex flex-wrap justify-center gap-2">{monthLis}</ol>
      </li>
    );
  });

  return (
    <SidebarItemLayout title="Archive list">
      <ol className="flex min-w-min flex-col gap-4">{dateLis}</ol>
    </SidebarItemLayout>
  );
};
