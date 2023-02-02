import { Link } from "gatsby";
import * as React from "react";
import { slugify } from "../libs/slugify";

const basePath = `b`; // TODO
const pagesPath = `pages`; // TODO

const commonClassName = `flex flex-none items-center justify-center rounded-lg text-center`;

const NumberLink = ({ basePath, pagesPath, linkNumber, str, className }) => (
  <Link
    to={
      linkNumber === 1
        ? slugify(basePath)
        : slugify(basePath, pagesPath, linkNumber)
    }
    className={`${commonClassName} ${className} hover:bg-sky-600`}
  >
    {str}
  </Link>
);

const PagesNav = ({ currentPageNumber, pagesTotal, needNumberLinks }) => {
  if (currentPageNumber <= 0) {
    throw new Error("`currentPageNumber` must be greater than equal 1.");
  }
  if (pagesTotal <= 0) {
    throw new Error("`pagesTotal` must be greater than equal 1.");
  }

  // Generate numbers (including `…` ).
  // ex: if `currentPageNumber === 4` , `pagesTotal === 7`
  // result: 1 ... 3 4 5 ... 7
  const sequence = [...new Array(pagesTotal)].map((_, i) => i + 1);
  const numbers = sequence.filter(
    (i) =>
      i === 1 ||
      i === currentPageNumber - 1 ||
      i === currentPageNumber ||
      i === currentPageNumber + 1 ||
      i === pagesTotal
  );

  if (4 <= currentPageNumber) {
    numbers.splice(1, 0, "…");
  }
  if (currentPageNumber <= pagesTotal - 3) {
    numbers.splice(numbers.length - 1, 0, "…");
  }

  const numberLinks = numbers.map((number, idx) => {
    if (number === "…") {
      return (
        <span
          key={idx === 1 ? "first…" : "last…"}
          className={`${commonClassName} w-12`}
        >
          …
        </span>
      );
    }

    if (number === currentPageNumber) {
      return (
        <span
          key={number}
          className={`${commonClassName} w-12 bg-sky-600/50 font-bold`}
        >
          {number}
        </span>
      );
    }

    return (
      <NumberLink
        key={number}
        basePath={basePath}
        pagesPath={pagesPath}
        linkNumber={number}
        str={number}
        className="w-12"
      />
    );
  });

  const previous =
    currentPageNumber !== 1 ? (
      <NumberLink
        key="previous"
        basePath={basePath}
        pagesPath={pagesPath}
        linkNumber={currentPageNumber - 1}
        str="« Previous"
        className="p-2"
      />
    ) : null;

  const next =
    currentPageNumber !== pagesTotal ? (
      <NumberLink
        key="previous"
        basePath={basePath}
        pagesPath={pagesPath}
        linkNumber={currentPageNumber + 1}
        str="Next »"
        className="p-2"
      />
    ) : null;

  return (
    <nav className="flex h-12 w-full">
      {previous}
      <div className="flex w-full justify-center gap-x-2">{numberLinks}</div>
      {next}
    </nav>
  );
};

export default PagesNav;
