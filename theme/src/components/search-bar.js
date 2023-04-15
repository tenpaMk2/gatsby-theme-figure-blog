import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { MagnifyingGlass } from "./svgs/magnifying-glass";

export const SearchBar = () => {
  const {
    site: {
      siteMetadata: { siteUrl },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  );

  return (
    <form
      action="//google.com/search"
      method="get"
      acceptCharset="UTF-8"
      className="flex min-w-0 gap-2 overflow-hidden rounded-full bg-white px-3 text-base text-black shadow-lg"
    >
      <input
        type="search"
        name="q"
        placeholder="Search"
        className="min-w-0 p-2"
      />
      <input type="hidden" name="sitesearch" value={siteUrl} />
      <div className="flex flex-col justify-center">
        <button
          type="submit"
          aria-label="Search"
          className="w-12 p-1 text-gray-300"
        >
          <MagnifyingGlass />
        </button>
      </div>
    </form>
  );
};
