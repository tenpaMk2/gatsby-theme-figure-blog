import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import TagCloud from "./tag-cloud";
import Bio from "./bio";
import ArchiveList from "./archive-list";

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
      {/* I don't use `gatsby-background-image` because it's not maintained. */}
      <header className="flex min-h-[18rem] w-full flex-col items-center bg-[url('/header.webp')] bg-cover bg-center pb-12 shadow-[inset_0_84px_53px_-53px_rgba(0,0,0,0.5),inset_0_-60px_23px_-23px_rgba(31,41,55,1)]">
        <div className="flex w-full justify-between text-white">
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
