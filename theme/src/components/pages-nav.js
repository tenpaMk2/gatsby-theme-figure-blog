import * as React from "react";
import { slugify } from "../libs/slugify";
import { LinkButton } from "./link-button";
import { ButtonBase } from "./button-base";
import { queryBlogConfig } from "../libs/query-blog-config";

export const PagesNav = ({ currentPageNumber, pagesStartPath, pagesTotal }) => {
  if (currentPageNumber <= 0) {
    throw new Error("`currentPageNumber` must be greater than equal 1.");
  }
  if (pagesTotal <= 0) {
    throw new Error("`pagesTotal` must be greater than equal 1.");
  }

  const { pagesPath } = queryBlogConfig();

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
        <div key={number} className="rounded-lg bg-sky-800 font-bold">
          <ButtonBase>{number}</ButtonBase>
        </div>
      );
    }

    return (
      <LinkButton
        key={number}
        to={
          number === 1
            ? slugify(...pagesStartPath.split(`/`))
            : slugify(...pagesStartPath.split(`/`), pagesPath, number)
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
            ? slugify(...pagesStartPath.split(`/`))
            : slugify(
                ...pagesStartPath.split(`/`),
                pagesPath,
                currentPageNumber - 1
              )
        }
      >
        « Previous
      </LinkButton>
    );

  const next =
    currentPageNumber === pagesTotal ? null : (
      <LinkButton
        key="next"
        to={slugify(
          ...pagesStartPath.split(`/`),
          pagesPath,
          currentPageNumber + 1
        )}
      >
        Next »
      </LinkButton>
    );

  return (
    // Need the wrapper div because `justify-center` has an unexpected behavior when overflow.
    // See [StackOverflow](https://stackoverflow.com/questions/34184535/change-justify-content-value-when-flex-items-overflow-container) .
    <div className="min-w-0 basis-full overflow-x-auto">
      <nav className="flex min-w-min flex-wrap justify-center gap-2">
        <div className="flex grow basis-0">{previous}</div>
        <div className="flex flex-wrap justify-center">{numberLinks}</div>
        <div className="flex grow basis-0 justify-end">{next}</div>
      </nav>
    </div>
  );
};
