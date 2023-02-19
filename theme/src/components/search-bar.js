import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

const SearchBar = () => {
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
      className="flex rounded-full bg-white px-4 text-base text-black shadow-lg"
    >
      <input type="search" name="q" placeholder="Search" className="p-2" />
      <input type="hidden" name="sitesearch" value={siteUrl} />
      <button type="submit">
        {/* [Get from.](https://www.svgrepo.com/svg/479944/magnifying-glass) */}
        <svg
          version="1.1"
          id="_x32_"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
          fill="currentColor"
          className="h-6 w-6 text-gray-500"
        >
          <g>
            <path d="M449.803,62.197C408.443,20.807,353.85-0.037,299.646-0.006C245.428-0.037,190.85,20.807,149.49,62.197 C108.1,103.557,87.24,158.15,87.303,212.338c-0.047,37.859,10.359,75.766,30.547,109.359L15.021,424.525 c-20.016,20.016-20.016,52.453,0,72.469c20,20.016,52.453,20.016,72.453,0L190.318,394.15 c33.578,20.203,71.5,30.594,109.328,30.547c54.203,0.047,108.797-20.797,150.156-62.188 c41.375-41.359,62.234-95.938,62.188-150.172C512.053,158.15,491.178,103.557,449.803,62.197z M391.818,304.541 c-25.547,25.531-58.672,38.125-92.172,38.188c-33.5-0.063-66.609-12.656-92.188-38.188c-25.531-25.578-38.125-58.688-38.188-92.203 c0.063-33.484,12.656-66.609,38.188-92.172c25.578-25.531,58.688-38.125,92.188-38.188c33.5,0.063,66.625,12.656,92.188,38.188 c25.531,25.563,38.125,58.688,38.188,92.172C429.959,245.854,417.365,278.963,391.818,304.541z"></path>
          </g>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;