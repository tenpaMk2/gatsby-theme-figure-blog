import * as React from "react";
import { Seo } from "@tenpamk2/gatsby-theme-figure-blog/src/components/seo";
import { Layout } from "@tenpamk2/gatsby-theme-figure-blog/src/components/layout";

const CustomPage = () => (
  <Layout>
    <div className="w-full rounded-xl bg-slate-700 p-6">
      <p className="bg-[#114514]">Can I use Tailwind CSS in example?</p>
    </div>
  </Layout>
);

export const Head = ({ location: { pathname } }) => (
  <Seo {...{ pathname, title: `Custom page` }} />
);

export default CustomPage;
