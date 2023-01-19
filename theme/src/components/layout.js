import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

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
    <div>
      <header className="relative">
        {/* See [gatsby-plugin-image doc](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#shared-props) */}
        <StaticImage
          src="../images/header.jpg"
          alt="header image"
          // See [gatsby-plugin-image doc](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#layout)
          layout="fullWidth"
          className="h-72"
        />
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
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  );
};

export default Layout;
