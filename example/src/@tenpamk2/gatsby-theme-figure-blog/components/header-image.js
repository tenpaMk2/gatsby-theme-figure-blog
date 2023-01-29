/**
 * Shadow it!!
 */

import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";

const HeaderImage = () => (
  // See [gatsby-plugin-image doc](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#shared-props)
  <StaticImage
    src="../../../images/header.jpg"
    alt="header image"
    // See [gatsby-plugin-image doc](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#layout)
    layout="fullWidth"
    className="h-72"
  />
);
export default HeaderImage;