import React from "react";

export const Footer = () => (
  <footer className="p-2 text-center text-gray-400">
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
);
