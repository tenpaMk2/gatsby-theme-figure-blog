import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { SearchBar } from "./search-bar";
import { Hamburger } from "./svgs/hamburger";
import { CloseCircle } from "./svgs/close-circle";

export const Header = () => {
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
    // I don't use `gatsby-background-image` because it's not maintained.
    <header className="flex min-h-[18rem] w-full flex-wrap overflow-x-auto bg-[url('/header.webp')] bg-cover bg-center px-4 pb-12 pt-4 shadow-[inset_0_84px_53px_-53px_rgba(0,0,0,0.5),inset_0_-60px_23px_-23px_rgba(31,41,55,1)]">
      <div className="flex min-w-0 basis-full flex-row-reverse items-start justify-between gap-2 text-base text-white md:text-xl">
        <input type="checkbox" id="hamburger" className="peer hidden" />

        <SearchBar />
        <div className="z-40 block grow peer-checked:hidden md:!hidden">
          <label for="hamburger" className="block h-12 w-12 text-2xl">
            <Hamburger />
          </label>
        </div>

        <div className="z-40 hidden grow peer-checked:block md:!hidden">
          <label for="hamburger" className="block h-12 w-12 text-2xl">
            <CloseCircle />
          </label>
        </div>

        {/* Sync this negative margin with the padding of the parent. */}
        <div className="absolute z-30 -m-4 hidden h-full w-screen min-w-0 bg-black/50 peer-checked:block md:static md:z-auto md:m-0 md:block md:h-auto md:w-auto md:bg-transparent">
          <div className="sticky h-screen w-2/3 min-w-0 bg-slate-800 py-24 px-4 md:static md:h-auto md:w-auto md:bg-transparent md:py-0">
            <nav className="flex min-w-0 flex-col gap-4 text-lg md:flex-row md:flex-wrap">
              {menus}
            </nav>
          </div>
        </div>
      </div>
      <h1 className="drop-shadow-title flex min-w-0 grow basis-full items-start justify-center font-sans text-2xl font-light text-white md:text-6xl">
        <Link to="/" className="min-w-0">
          {title}
        </Link>
      </h1>
    </header>
  );
};
