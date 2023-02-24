import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

const Bio = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              name
              summary
            }
            social {
              github
              instagram
              twitter
            }
          }
        }
      }
    `
  );

  const name = siteMetadata?.author?.name || `NO NAME`;
  const summary = siteMetadata?.author?.summary || ``;
  const twitter = siteMetadata?.social?.twitter || ``;
  const instagram = siteMetadata?.social?.instagram || ``;
  const github = siteMetadata?.social?.github || ``;

  return (
    <div className="flex min-w-0 basis-full flex-wrap content-start gap-4">
      <h1 className="basis-full overflow-x-auto py-1 text-4xl">Bio</h1>
      <div className="basis-full overflow-x-auto">
        <div className="flex min-w-min flex-wrap gap-4 rounded-lg bg-slate-900 p-4 shadow-inner">
          <div className="flex basis-full flex-wrap gap-2">
            <div className="flex basis-full justify-center">
              <StaticImage
                src="../images/bio.jpg"
                alt="Bio image"
                className="isolate w-32 rounded-full" // `isolate` is needed to work around [iOS bug](https://gotohayato.com/content/556/) .
              />
            </div>
            <h2 className="flex basis-full justify-center text-2xl font-bold">
              {name}
            </h2>
          </div>
          <p className="flex basis-full justify-center">{summary}</p>
          <div className="flex basis-full flex-wrap justify-center gap-2">
            <a
              className="inline-flex items-center rounded-full bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
              target="_blank"
              rel="noopener"
              href={`https://twitter.com/${twitter}/`}
              aria-label="Twitter"
              draggable="false"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-6 w-6"
              >
                <title>Twitter</title>
                <path d="m459 152 1 13c0 139-106 299-299 299-59 0-115-17-161-47a217 217 0 0 0 156-44c-47-1-85-31-98-72l19 1c10 0 19-1 28-3-48-10-84-52-84-103v-2c14 8 30 13 47 14A105 105 0 0 1 36 67c51 64 129 106 216 110-2-8-2-16-2-24a105 105 0 0 1 181-72c24-4 47-13 67-25-8 24-25 45-46 58 21-3 41-8 60-17-14 21-32 40-53 55z"></path>
              </svg>
            </a>
            <a
              className="inline-flex items-center rounded-full bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
              target="_blank"
              rel="noopener"
              href={`https://www.instagram.com/${instagram}/`}
              aria-label="Instagram"
              draggable="false"
            >
              {/* [Get from.](https://www.svgrepo.com/svg/497210/instagram) */}
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fillOpacity="0"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <title>Instagram</title>
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M17.6361 7H17.6477"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </a>
            <a
              className="inline-flex items-center rounded-full bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
              target="_blank"
              rel="noopener"
              href={`https://github.com/${github}/`}
              aria-label="GitHub"
              draggable="false"
            >
              {/* [Get from.](https://www.svgrepo.com/svg/494343/github) */}
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="currentColor"
                viewBox="-267 288.9 264.5 225.1"
                className="h-6 w-6"
                version="1.1"
              >
                <title>GitHub</title>
                <path d="M-21.8,354.4c-0.8-0.9-1.3-2.3-1.2-3.5c0.9-20.1-1.8-39.6-8.6-58.6c-0.9-2.4-2-3.3-4.5-2.6c-5.6,1.7-11.4,3-16.9,5 c-15.2,5.5-29.1,13.5-42.6,22.2c-1.4,0.9-3.5,1.5-5.2,1.2c-22.1-3.9-44.3-3.7-66.5-0.3c-2.2,0.3-5-0.2-6.8-1.3 c-15.7-10.2-31.7-20.2-50-25c-15.1-4-12-4.8-16.3,8.9c-5.1,16.4-7.1,33.4-6,50.6c0.1,1.2-0.8,2.7-1.6,3.8 c-6.6,7.9-11.7,16.6-14.8,26.4c-6,19-4.8,38.2-1,57.3c7.5,37.5,32.8,63.8,70.2,70.3c19.3,3.4,39.2,3.7,57.3,5.2 c20.2-1.5,38.9-1.6,57.1-4.5c31.8-5.1,55.8-22,67.8-52.7c4.2-10.7,6.5-22.4,7.9-33.8C-0.3,397.9-4.6,374.3-21.8,354.4z M-39.5,458.8c-3.3,15.6-12.4,26.3-27.6,31.8c-14.7,5.4-29.9,7.6-45.4,8.6c-7.5,0.5-15,0.1-22.5,0.1c-20.2,0.4-40.4-0.4-59.9-6.2 c-24.5-7.3-35.5-21.9-36.2-47.5c-0.3-9.1,0.7-17.9,5-26.1c8.5-16.5,23.2-22.3,40.6-22.6c9.5-0.1,19.1,0.7,28.7,1.6 c20.1,1.8,40-0.1,60-1.2c8.8-0.5,17.8-0.7,26.4,0.8c18.5,3.2,32.5,21.6,32.8,42.3C-37.6,446.5-38.3,452.8-39.5,458.8z"></path>
                <path d="M-191.5,424.5c-5.5,5.7-7.4,12.9-7.7,19.3c0,9.6,2.8,17.3,7.7,22.3c6.8,6.9,16.1,6.7,22.6-0.3c9.8-10.6,9.7-30.5,0-41 C-175.4,417.7-184.9,417.6-191.5,424.5z"></path>
                <path d="M-99.4,423.7c-11.2,10.3-11.2,33,0,43.2c6.5,5.9,15.3,5.6,21.4-0.7c5.6-5.8,7.6-13.1,7.8-21c-0.2-7.9-2.2-15.1-7.9-20.9 C-84.2,418-93,417.8-99.4,423.7z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;
