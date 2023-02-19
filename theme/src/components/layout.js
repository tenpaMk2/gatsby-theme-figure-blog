import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import TagCloud from "./tag-cloud";
import Bio from "./bio";
import ArchiveList from "./archive-list";

const Layout = ({ children }) => {
  const {
    site: {
      siteMetadata: { title, menuLinks },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            menuLinks {
              link
              name
            }
          }
        }
      }
    `
  );

  const menus = menuLinks?.map(({ name, link }) => (
    <Link key={link} to={link}>
      {name}
    </Link>
  ));

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-800 text-gray-200">
      {/* I don't use `gatsby-background-image` because it's not maintained. */}
      <header className="flex min-h-[18rem] w-full flex-col items-center bg-[url('/header.webp')] bg-cover bg-center px-4 pb-12 pt-4 shadow-[inset_0_84px_53px_-53px_rgba(0,0,0,0.5),inset_0_-60px_23px_-23px_rgba(31,41,55,1)]">
        <div className="flex w-full flex-wrap justify-between text-xl text-white">
          <nav className="flex flex-wrap gap-4">{menus}</nav>
          <form
            action="//google.com/search"
            method="get"
            acceptCharset="UTF-8"
            className="flex rounded-full bg-white px-4 text-base text-black shadow-lg"
          >
            <input
              type="search"
              name="q"
              placeholder="Search"
              className="p-2"
            />
            <input
              type="hidden"
              name="sitesearch"
              value="https://tenpamk2-blog.netlify.app"
            />
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
        </div>
        <h1 className="drop-shadow-title flex grow flex-col justify-center text-center font-sans text-6xl font-light text-white">
          <Link to="/">{title}</Link>
        </h1>
      </header>

      <div className="flex w-full max-w-screen-2xl grow flex-wrap justify-center gap-4 px-4">
        {/* [Great idea for shrink priority.](https://stackoverflow.com/questions/67858284/how-to-have-one-item-shrink-fully-before-another-starts-to-shrink) */}
        {/* Must set not only `basis-[***]` but also `max-w-[***]` due to the very long code in the code block. */}
        <main className="flex max-w-[1024px] shrink grow-0 basis-[1024px] flex-col flex-wrap gap-4">
          {children}
        </main>
        <div className="flex max-w-[1024px] shrink-0 grow basis-[20rem] flex-col gap-6">
          <Bio />
          <TagCloud />
          <ArchiveList />
        </div>
      </div>
      <footer className="w-full p-2 text-center text-slate-400">
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com" className="underline">
          Gatsby
        </a>
        .
      </footer>
    </div>
  );
};

export default Layout;
