import React from "react";

export const PostTitle = ({ children }) => (
  <h1
    itemProp="headline"
    className="m-0 flex items-center p-0 text-lg font-bold md:text-4xl"
  >
    {children}
  </h1>
);
