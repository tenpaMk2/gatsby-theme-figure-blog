import React from "react";

export const SidebarItemLayout = ({ children, title }) => (
  <div className="flex min-w-0 flex-wrap content-start gap-4">
    <div className="basis-full overflow-x-auto py-1 text-xl md:text-4xl">
      {title}
    </div>
    <div className="basis-full overflow-x-auto rounded-lg bg-slate-900 p-2 shadow-inner md:p-4">
      {children}
    </div>
  </div>
);
