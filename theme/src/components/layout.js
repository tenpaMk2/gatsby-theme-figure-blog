import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import HeaderImage from "./header-image";
import TagCloud from "./tag-cloud";
import Bio from "./bio";

const Layout = ({ children }) => {
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
    <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-800 text-gray-200">
      <header className="relative w-full grow-0">
        <HeaderImage />

        {/* add shade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-800 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-800" />

        <div className="absolute top-0 left-0 text-white">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/archives/">Archives</Link>
            <Link to="/about/">About</Link>
            <Link to="/apps/">Apps</Link>
          </nav>
          <nav>
            <Link to="/">RSS</Link>
            <Link to="/">RSSフィギュア</Link>
            <Link to="/">RSSドール</Link>
            <Link to="/">検索</Link>
          </nav>
        </div>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-6xl font-light text-white drop-shadow">
          <Link to="/">{title}</Link>
        </h1>
      </header>

      <div className="flex w-full max-w-screen-2xl grow flex-wrap justify-center gap-4 px-6">
        {/* [Great idea for shrink priority.](https://stackoverflow.com/questions/67858284/how-to-have-one-item-shrink-fully-before-another-starts-to-shrink) */}
        {/* Must set not only `basis-[***]` but also `max-w-[***]` due to the very long code in the code block. */}
        <main className="flex max-w-[1024px] shrink grow-0 basis-[1024px] flex-col flex-wrap gap-4">
          {children}
        </main>
        <div className="flex max-w-[1024px] shrink-0 grow basis-[20rem] flex-col gap-4 p-2">
          <Bio />
          <hr className="border-slate-500" />
          <TagCloud />
          <hr className="border-slate-500" />
          <div>🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉</div>
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
