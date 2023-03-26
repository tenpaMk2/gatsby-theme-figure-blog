import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { SearchBar } from "./search-bar";
import { Hamburger } from "./svgs/hamburger";
import { NavLinks } from "./nav-links";

export const Header = () => {
  const {
    site: {
      siteMetadata: { title },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    // I don't use `gatsby-background-image` because it's not maintained.
    <header className="flex min-h-[18rem] w-full flex-wrap overflow-x-auto bg-[url('/header.webp')] bg-cover bg-center px-4 pb-12 pt-4 shadow-[inset_0_84px_53px_-53px_rgba(0,0,0,0.5),inset_0_-60px_23px_-23px_rgba(31,41,55,1)]">
      <div className="flex min-w-0 basis-full flex-row-reverse items-start justify-between gap-2 text-base text-white md:text-xl">
        <SearchBar />

        <div className="grow md:hidden">
          <label htmlFor="hamburger" className="block h-12 w-12 text-2xl">
            <Hamburger />
          </label>
        </div>

        <nav className="hidden min-w-0 flex-row flex-wrap gap-4 text-lg md:flex">
          <NavLinks />
        </nav>
      </div>
      <h1 className="drop-shadow-title flex min-w-0 grow basis-full items-start justify-center font-sans text-2xl font-light text-white md:text-6xl">
        <Link to="/" className="min-w-0">
          {title}
        </Link>
      </h1>
    </header>
  );
};
