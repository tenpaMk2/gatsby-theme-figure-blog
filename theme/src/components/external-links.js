import React from "react";
import { queryBlogConfig } from "../libs/query-blog-config";
import { SidebarItemLayout } from "./sidebar-item-layout";

export const ExternalLinks = () => {
  const { externalLinks } = queryBlogConfig();

  const links = externalLinks.map(({ name, url }) => {
    return (
      <li key={url} className="py-1">
        <a href={url} className="underline">
          {name}
        </a>
      </li>
    );
  });

  return (
    <SidebarItemLayout title="External links">
      <ol className="list-disc pl-4 text-lg">{links}</ol>
    </SidebarItemLayout>
  );
};
