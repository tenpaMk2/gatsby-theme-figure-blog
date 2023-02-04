import * as React from "react";
import { Seo } from "../components/seo";
import Layout from "../components/layout";

const NotFoundPage = () => (
  <Layout>
    <h1 className="text-3xl">😹 Not Found 😿</h1>
  </Layout>
);

export const Head = () => <Seo title="404" />;

export default NotFoundPage;
