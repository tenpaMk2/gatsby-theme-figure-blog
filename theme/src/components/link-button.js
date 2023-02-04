import { Link } from "gatsby";
import * as React from "react";
import { ButtonBase } from "./button-base";

export const LinkButton = ({ to, children }) => (
  <Link to={to} className="rounded-lg hover:bg-sky-600">
    <ButtonBase>{children}</ButtonBase>
  </Link>
);
