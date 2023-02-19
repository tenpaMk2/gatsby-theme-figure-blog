import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { slugify } from "../libs/slugify";
import { LinkButton } from "./link-button";
import { ButtonBase } from "./button-base";
import { queryBlogConfig } from "../libs/query-blog-config";

const PagesNav = ({ currentPageNumber, pagesTotal }) => {
  if (currentPageNumber <= 0) {
    throw new Error("`currentPageNumber` must be greater than equal 1.");
  }
  if (pagesTotal <= 0) {
    throw new Error("`pagesTotal` must be greater than equal 1.");
  }

  const { basePath, pagesPath } = queryBlogConfig();

  // Generate numbers (including `…` ).
  // ex: if `currentPageNumber === 5` , `pagesTotal === 9`
  // result: 1 ... 3 4 5 6 7 ... 9
  const sequence = [...new Array(pagesTotal)].map((_, i) => i + 1);
  const numbers = sequence.filter(
    (i) =>
      i === 1 ||
      i === currentPageNumber - 2 ||
      i === currentPageNumber - 1 ||
      i === currentPageNumber ||
      i === currentPageNumber + 1 ||
      i === currentPageNumber + 2 ||
      i === pagesTotal
  );

  // Add a start ellipsis.
  if (5 <= currentPageNumber) {
    numbers.splice(1, 0, "…");
  }
  // Add a end ellipsis.
  if (currentPageNumber <= pagesTotal - 4) {
    numbers.splice(numbers.length - 1, 0, "…");
  }

  const numberLinks = numbers.map((number, idx) => {
    if (number === "…") {
      return <ButtonBase key={idx === 1 ? "first…" : "last…"}>…</ButtonBase>;
    }

    if (number === currentPageNumber) {
      return (
        <div key={number} className="rounded-lg bg-sky-600/50 font-bold">
          <ButtonBase>{number}</ButtonBase>
        </div>
      );
    }

    return (
      <LinkButton
        key={number}
        to={
          number === 1
            ? slugify(basePath)
            : slugify(basePath, pagesPath, number)
        }
      >
        {number}
      </LinkButton>
    );
  });

  const previous =
    currentPageNumber === 1 ? null : (
      <LinkButton
        key="previous"
        to={
          currentPageNumber === 2
            ? slugify(basePath)
            : slugify(basePath, pagesPath, currentPageNumber - 1)
        }
      >
        « Previous
      </LinkButton>
    );

  const next =
    currentPageNumber === pagesTotal ? null : (
      <LinkButton
        key="next"
        to={slugify(basePath, pagesPath, currentPageNumber + 1)}
      >
        Next »
      </LinkButton>
    );

  return (
    <nav className="flex basis-full gap-2">
      {previous}
      <div className="flex grow justify-center gap-2">{numberLinks}</div>
      {next}
    </nav>
  );
};

export default PagesNav;
