import * as React from "react";

export const PostTitle = ({ children }) => (
  <h1
    itemProp="headline"
    className="flex grow basis-1/2 items-center text-lg md:text-4xl"
  >
    {children}
  </h1>
);
