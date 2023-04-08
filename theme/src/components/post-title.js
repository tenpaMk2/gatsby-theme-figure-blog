import React from "react";

const className = "m-0 flex items-center p-0 text-lg font-bold md:text-4xl";

export const PostTitle = ({ isArticleHeader, children }) =>
  isArticleHeader ? (
    <h1 itemProp="headline" className={className}>
      {children}
    </h1>
  ) : (
    <p className={className}>{children}</p>
  );
