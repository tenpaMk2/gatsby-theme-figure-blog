import * as React from "react";
import { TagCloud } from "./tag-cloud";
import { Bio } from "./bio";
import { ArchiveList } from "./archive-list";
import { ExternalLinks } from "./external-links";

export const Sidebar = () => (
  <div className="flex w-full min-w-0 flex-col gap-6">
    <Bio />
    <TagCloud />
    <ArchiveList />
    <ExternalLinks />
  </div>
);
