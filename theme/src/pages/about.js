import * as React from "react";
import { Link } from "gatsby";

const AboutPage = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold borderline bg-red-500">About Me</h1>
      <Link to="/">Back to Home</Link>
      <p className="bg-red-500">HOGEEEEEEEEEEEE❗</p>
      <div className="bg-red-500">fua</div>
    </main>
  );
};

export const Head = () => <title>About Me</title>;

export default AboutPage;
