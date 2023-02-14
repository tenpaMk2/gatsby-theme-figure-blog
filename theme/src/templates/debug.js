import React from "react";
import { graphql } from "gatsby";

const Row = ({ items }) => (
  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
    {items.map((item, i) => (
      <td key={i} className="max-w-xs px-4 py-2">
        {item?.toString()}
      </td>
    ))}
  </tr>
);

const varToString = (varObj) => Object.keys(varObj)[0];

const toOKOrNG = (x) => (x ? `OK` : `NG`);

const isDuplicateTagSlugs = (tagInfos) => {
  const uniqueSlugs = new Set(tagInfos.map(({ slug }) => slug));
  return tagInfos.length !== uniqueSlugs.size;
};

const Debug = ({
  data: {
    __type: { fields },
    figureBlogConfig,
    postsInfo,
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
        !yearMonthInfos.some(
          ({ dateKey }) => 2999 <= new Date(dateKey).getFullYear()
        )
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
    <div>
      <h2 className="text- text-2xl">Tests</h2>
      <table className="table-auto overflow-hidden rounded-lg text-left">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">category</th>
            <th className="px-4 py-2">description</th>
            <th className="px-4 py-2">OK or NG</th>
            <th className="px-4 py-2">message</th>
          </tr>
        </thead>
        <tbody>{testRows}</tbody>
      </table>
    </div>
  );

  const tagRows = tagInfos
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map(({ count, name, slug }) => (
      <Row key={slug} items={[name, slug, count]} />
    ));
  const tagInfosTable = (
    <div>
      <h2 className="text- text-2xl">Tag infos</h2>
      <table className="table-auto overflow-hidden rounded-lg text-left">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">name</th>
            <th className="px-4 py-2">slug</th>
            <th className="px-4 py-2">count</th>
          </tr>
        </thead>
        <tbody>{tagRows}</tbody>
      </table>
    </div>
  );

  const yearRows = yearInfos
    .sort((a, b) => (a.year < b.year ? -1 : 1))
    .map(({ count, year }) => <Row key={year} items={[year, count]} />);
  const yearInfosTable = (
    <div>
      <h2 className="text- text-2xl">Year infos</h2>
      <table className="table-auto overflow-hidden rounded-lg text-left">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">year</th>
            <th className="px-4 py-2">count</th>
          </tr>
        </thead>
        <tbody>{yearRows}</tbody>
      </table>
    </div>
  );

  const yearMonthRows = yearMonthInfos
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1))
    .map(({ count, dateKey, month, year }) => (
      <Row key={dateKey} items={[dateKey, year, month, count]} />
    ));
  const yearMonthInfosTable = (
    <div>
      <h2 className="text- text-2xl">Year month infos</h2>
      <table className="table-auto overflow-hidden rounded-lg text-left">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">dateKey</th>
            <th className="px-4 py-2">year</th>
            <th className="px-4 py-2">month</th>
            <th className="px-4 py-2">count</th>
          </tr>
        </thead>
        <tbody>{yearMonthRows}</tbody>
      </table>
    </div>
  );

  const figureBlogConfigFields = fields
    .filter(({ type: { kind } }) => kind === `SCALAR`)
    .map(({ name }) => name);

  console.log(figureBlogConfigFields);

  const figureBlogConfigRows = figureBlogConfigFields.map((field) => (
    <Row
      key={field}
      items={[
        field,
        figureBlogConfig.hasOwnProperty(field) ? `OK` : `FORGOT`,
        figureBlogConfig[field],
      ]}
    />
  ));
  const figureBlogConfigTable = (
    <div>
      <h2 className="text- text-2xl">Figure blog config</h2>
      <table className="table-auto overflow-hidden rounded-lg text-left">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">field</th>
            <th className="px-4 py-2">query?</th>
            <th className="px-4 py-2">value</th>
          </tr>
        </thead>
        <tbody>{figureBlogConfigRows}</tbody>
      </table>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-wrap items-start gap-4 bg-slate-800 p-4 text-gray-500 dark:text-gray-400">
      {testsTable}
      {tagInfosTable}
      {yearInfosTable}
      {yearMonthInfosTable}
      {figureBlogConfigTable}
    </div>
  );
};

export default Debug;

export const pageQuery = graphql`
  query {
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
      formatString
      locale
      pagesPath
      postPath
      postsPerPage
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
        year
      }
      yearMonthInfos {
        count
        dateKey
        month
        year
      }
    }
  }
`;
