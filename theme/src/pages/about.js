import * as React from "react";
import Layout from "../components/layout";

// TODO: Use markdown post.
const AboutPage = () => (
  <Layout>
    <article
      className="w-full rounded-xl bg-slate-700 p-8"
      itemScope
      itemType="http://schema.org/Article"
    >
      <section className="prose prose-invert max-w-none">
        <header>
          <h1 itemProp="headline" className="mb-2">
            This is an About page.
          </h1>
          <time dateTime="2023-02-11 19:24">2023-02-11 19:24</time>
          <hr className="my-2 border border-slate-500" />
        </header>
        <section itemProp="articleBody">
          <p>Shadow `about.js` however you like❗</p>
          <p>
            Copy
            `node_modules/@tenpamk2/gatsby-theme-figure-blog/src/pages/about.js`
            to `src/@tenpamk2/gatsby-theme-figure-blog/pages/about.js` .
          </p>
          <p>Edit `src/@tenpamk2/gatsby-theme-figure-blog/pages/about.js` .</p>
        </section>
      </section>
      <footer>
        <hr className="my-2 border border-slate-500" />
      </footer>
    </article>
  </Layout>
);

export const Head = () => <title>About Me</title>;

export default AboutPage;
