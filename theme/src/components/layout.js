import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { TagCloud } from "./tag-cloud";
import { Bio } from "./bio";
import { ArchiveList } from "./archive-list";
import { SearchBar } from "./search-bar";

export const Layout = ({ children }) => {
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
    <div className="flex min-h-screen flex-wrap content-start justify-center gap-6 bg-slate-800 text-gray-200">
      {/* I don't use `gatsby-background-image` because it's not maintained. */}
      <header className="flex min-h-[18rem] min-w-0 basis-full flex-wrap overflow-x-auto bg-[url('/header.webp')] bg-cover bg-center px-4 pb-12 pt-4 shadow-[inset_0_84px_53px_-53px_rgba(0,0,0,0.5),inset_0_-60px_23px_-23px_rgba(31,41,55,1)]">
        <div className="flex min-w-0 basis-full flex-wrap items-start justify-between text-base text-white md:text-xl">
          <nav className="flex min-w-0 flex-wrap gap-4">{menus}</nav>
          <SearchBar />
        </div>
        <h1 className="drop-shadow-title flex min-w-0 grow basis-full items-start justify-center font-sans text-2xl font-light text-white md:text-6xl">
          <Link to="/" className="min-w-0">
            {title}
          </Link>
        </h1>
      </header>

      <div className="flex min-w-0 max-w-screen-2xl grow basis-full flex-wrap justify-center gap-4 px-2 md:px-4">
        <main className="flex min-w-0 max-w-[1024px] shrink grow-[999999] basis-[1024px] flex-wrap content-start gap-4">
          {children}
        </main>
        {/* Sidebar layout logic is [here](https://every-layout.dev/layouts/sidebar/) . */}
        <div className="flex min-w-0 max-w-[1024px] shrink grow basis-[20rem] flex-col gap-6">
          <Bio />
          <TagCloud />
          <ArchiveList />
        </div>
      </div>
      <footer className="min-w-0 basis-full p-2 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com" className="underline">
            Gatsby
          </a>
          .
        </p>
        <p>
          <a
            href="https://github.com/tenpaMk2/gatsby-theme-figure-blog"
            className="underline"
          >
            Figure blog theme
          </a>
          {` `}
          by tenpaMk2.
        </p>
      </footer>
    </div>
  );
};
