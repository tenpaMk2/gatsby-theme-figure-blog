import * as React from "react";

export const PostTitle = ({ children }) => (
  <h1 itemProp="headline" className="flex items-center text-lg md:text-4xl">
    {children}
  </h1>
);
