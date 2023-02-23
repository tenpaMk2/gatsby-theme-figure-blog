import * as React from "react";
import { Seo } from "../components/seo";
import Layout from "../components/layout";

const NotFoundPage = () => (
  <Layout>
    <div className="flex h-80 basis-full flex-wrap content-center items-center gap-4 rounded-xl bg-slate-700 p-6 text-center text-6xl font-bold tracking-widest">
      <p className="basis-full">⚠404⚠</p>
      <p className="basis-full">⚠Errors⚠</p>
    </div>
  </Layout>
);

export const Head = () => <Seo title="404" pathname="/404/" />;

export default NotFoundPage;
