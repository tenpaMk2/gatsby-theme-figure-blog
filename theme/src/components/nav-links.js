import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";

export const NavLinks = () => {
  const {
    site: {
      siteMetadata: { menuLinks },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
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

  return menus;
};
