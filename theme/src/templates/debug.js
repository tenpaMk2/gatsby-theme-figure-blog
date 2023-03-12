import React from "react";
import { graphql } from "gatsby";

const Row = ({ items }) => (
  <tr className="border-b border-slate-500 bg-slate-900 text-gray-400">
    {items.map((item, i) => (
      <td key={i} className="max-w-xs px-4 py-2">
        {item?.toString()}
      </td>
    ))}
  </tr>
);

const Table = ({ title, headers, children, annotation }) => (
  <div className="flex flex-auto flex-col gap-2">
    <h2 className="text-2xl">{title}</h2>
    <table className="w-full table-auto overflow-hidden rounded-lg text-left">
      <thead className="bg-slate-700 text-gray-200">
        <tr>
          {headers.map((header) => (
            <th className="px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    {annotation}
  </div>
);

const varToString = (varObj) => Object.keys(varObj)[0];

const toOKOrNG = (x) => (x ? `OK` : `NG`);

const isDuplicateTagSlugs = (tagInfos) => {
  const uniqueSlugs = new Set(tagInfos.map(({ slug }) => slug));
  return tagInfos.length !== uniqueSlugs.size;
};

const DebugTemplate = ({
  data: {
    __type: { fields },
    figureBlogConfig,
    postsInfo,
    allMarkdownPost: { nodes },
  },
}) => {
  const { tagInfos, yearInfos, yearMonthInfos } = postsInfo;

  const tests = [
    {
      category: varToString({ postsInfo }),
      description: `${varToString({ postsInfo })} exists?`,
      isOK: toOKOrNG(!!postsInfo),
      message: ``,
    },
    {
      category: varToString({ postsInfo }),
      description: `${varToString({ tagInfos })} exists?`,
      isOK: toOKOrNG(!!tagInfos),
      message: ``,
    },
    {
      category: varToString({ postsInfo }),
      description: `${varToString({ yearInfos })} exists?`,
      isOK: toOKOrNG(!!yearInfos),
      message: ``,
    },
    {
      category: varToString({ postsInfo }),
      description: `${varToString({ yearMonthInfos })} exists?`,
      isOK: toOKOrNG(!!yearMonthInfos),
      message: ``,
    },
    {
      category: varToString({ postsInfo }),
      description: `Duplicate tag-slugs?`,
      isOK: toOKOrNG(!isDuplicateTagSlugs(tagInfos)),
      message: [
        `Maybe, is there misspelling or capitalization error in the tag name?`,
        `Check the tag infos table.`,
      ].join(` `),
    },
    {
      category: varToString({ postsInfo }),
      description: `Any no date posts?`,
      isOK: toOKOrNG(
        !yearMonthInfos.some(({ yearNumber }) => 2999 <= yearNumber)
      ),
      message: `Maybe, is there posts that has no date in the frontmatter?`,
    },
  ];

  const testRows = tests.map(({ category, description, isOK, message }) => {
    return (
      <Row
        key={`${category}${description}`}
        items={[category, description, isOK, message]}
      />
    );
  });
  const testsTable = (
    <Table
      title="Tests"
      headers={[`Category`, `Description`, `OK or NG`, `Message`]}
    >
      {testRows}
    </Table>
  );

  const tagRows = tagInfos
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map(({ count, name, slug }) => (
      <Row key={slug} items={[name, slug, count]} />
    ));
  const tagInfosTable = (
    <Table title="Tag infos" headers={["`name`", "`slug`", "`count`"]}>
      {tagRows}
    </Table>
  );

  const yearRows = yearInfos
    .sort((a, b) => (a.yearNumber < b.yearNumber ? -1 : 1))
    .map(({ count, yearNumber, yearString }) => (
      <Row key={yearNumber} items={[yearNumber, yearString, count]} />
    ));
  const yearInfosTable = (
    <Table
      title="Year infos"
      headers={["`yearNumber`", "`yearString`", "`count`"]}
    >
      {yearRows}
    </Table>
  );

  const yearMonthRows = yearMonthInfos
    .sort((a, b) =>
      `${a.yearNumber.toString().padStart(4, `0`)}${a.monthNumber
        .toString()
        .padStart(2, `0`)}` <
      `${b.yearNumber.toString().padStart(4, `0`)}${b.monthNumber
        .toString()
        .padStart(2, `0`)}`
        ? -1
        : 1
    )
    .map(({ count, monthNumber, monthString, yearNumber, yearString }) => (
      <Row
        key={`${yearNumber}${monthNumber}`}
        items={[yearNumber, yearString, monthNumber, monthString, count]}
      />
    ));
  const yearMonthInfosTable = (
    <Table
      title="Year month infos"
      headers={[
        "`yearNumber`",
        "`yearString`",
        "`monthNumber`",
        "`monthString`",
        "`count`",
      ]}
    >
      {yearMonthRows}
    </Table>
  );

  const figureBlogConfigFields = fields
    .filter(
      ({ name }) => ![`id`, `parent`, `children`, `internal`].includes(name)
    )
    .map(({ name }) => name);

  const figureBlogConfigRows = figureBlogConfigFields.map((field) => (
    <Row
      key={field}
      items={[
        field,
        figureBlogConfig.hasOwnProperty(field) ? `Yes` : `FORGOT`,
        typeof figureBlogConfig[field] === `object`
          ? `**See other tables.**`
          : JSON.stringify(figureBlogConfig[field]),
      ]}
    />
  ));
  const figureBlogConfigTable = (
    <Table
      title="Figure blog config"
      headers={[`Field`, `Have queried?`, `Value`]}
      annotation={
        <p className="max-w-prose">
          If you see any `FORGOT` , check query in `debug.js` , type definitions
          in `gatsby-node.js` , and return values in `default-options.js` .
        </p>
      }
    >
      {figureBlogConfigRows}
    </Table>
  );

  const externalLinksRows = figureBlogConfig.externalLinks.map(
    ({ name, url }, i) => <Row key={url} items={[i, name, url]} />
  );
  const externalLinksTable = (
    <Table
      title="Figure blog config: externalLinks"
      headers={[`No.`, "`name`", "`url`"]}
    >
      {externalLinksRows}
    </Table>
  );

  return (
    <div className="flex min-h-screen flex-wrap items-start gap-4 bg-slate-800 p-4 text-gray-200">
      {testsTable}
      {tagInfosTable}
      {yearInfosTable}
      {yearMonthInfosTable}
      {figureBlogConfigTable}
      {externalLinksTable}
      <div className="flex min-w-0 flex-auto flex-col gap-2">
        <h2 className="text-2xl">{"RSS <description>"}</h2>
        <div className="flex min-w-0 flex-wrap items-start gap-4">
          {nodes.map(({ rssDescription }) => (
            <div className="min-w-0 rounded border bg-slate-700 p-2">
              {rssDescription}
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-auto flex-col gap-2">
        <h2 className="text-2xl">{"RSS <content:encoded>"}</h2>
        <div className="flex min-w-0 flex-wrap items-start gap-4">
          {nodes.map(({ rssContentEncoded }) => (
            <div
              className="min-w-0 rounded border bg-slate-700 p-2"
              dangerouslySetInnerHTML={{ __html: rssContentEncoded }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugTemplate;

export const pageQuery = graphql`
  query {
    # [Don't use introspection in production.](https://www.apollographql.com/blog/graphql/security/why-you-should-disable-graphql-introspection-in-production/)
    __type(name: "FigureBlogConfig") {
      fields {
        name
        type {
          kind
        }
      }
    }
    figureBlogConfig {
      archivesPath
      basePath
      externalLinks {
        name
        url
      }
      cardsPerPage
      debugPath
      formatStringMonthAndDay
      formatStringTime
      formatStringYear
      locale
      pagesPath
      playgroundPath
      postPath
      postsPerPage
      rssPruneLength
      rssTruncate
      tagsPath
    }
    postsInfo {
      id
      tagInfos {
        count
        name
        slug
      }
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
    allMarkdownPost {
      nodes {
        rssContentEncoded
        rssDescription
      }
    }
  }
`;
