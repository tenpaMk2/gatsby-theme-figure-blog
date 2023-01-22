import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import HeaderImage from "./header-image";

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
    <div className="flex flex-wrap justify-center bg-slate-800 text-gray-300">
      <header className="relative w-full flex-auto">
        <HeaderImage />
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
      <main className="flex w-full max-w-screen-lg flex-auto flex-wrap justify-center">
        {children}
      </main>
      <footer className="m-4 w-full flex-auto text-center">
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
