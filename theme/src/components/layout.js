import * as React from "react";
import { Header } from "./header";
import { CloseCircle } from "./svgs/close-circle";
import { NavLinks } from "./nav-links";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

export const Layout = ({ children }) => (
  <div className="flex min-h-screen flex-wrap content-start justify-center gap-6 bg-slate-800 text-gray-200">
    <Header />

    <div className="flex min-w-0 max-w-screen-2xl grow basis-full flex-wrap justify-center gap-4 px-2 md:px-4">
      <main className="flex min-w-0 max-w-[1024px] shrink grow-[999999] basis-[1024px] flex-wrap content-start gap-4">
        {children}
      </main>
      {/* Sidebar layout logic is [here](https://every-layout.dev/layouts/sidebar/) . */}
      <div className="min-w-0 max-w-[1024px] shrink grow basis-[20rem]">
        <Sidebar />
      </div>
    </div>
    <div className="min-w-0 basis-full overflow-auto">
      <Footer />
    </div>

    {/* This `hamburger` affects `<body>` , see `seo.js` . */}
    <input type="checkbox" id="hamburger" className="peer hidden" />
    <div className="invisible absolute h-screen w-screen min-w-0 bg-black/50 opacity-0 transition peer-checked:visible peer-checked:opacity-100 md:!hidden">
      <div className="flex h-screen w-2/3 min-w-0 -translate-x-2/3 flex-col gap-4 bg-slate-800 p-4 transition duration-500 [#hamburger:checked+div>&]:translate-x-0">
        <label htmlFor="hamburger" className="block h-12 w-12 text-2xl">
          <CloseCircle />
        </label>

        <nav className="flex min-w-0 flex-col gap-4 text-lg">
          <NavLinks />
        </nav>
      </div>
    </div>
  </div>
);
