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
              twitter
              instagram
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

  return (
    <div className="flex flex-wrap gap-4">
      <h1 className="text-4xl">Bio</h1>
      <div className="flex w-full flex-col gap-4 rounded-lg bg-slate-900 p-4 shadow-inner">
        <div className="flex justify-center">
          <StaticImage
            src="../images/bio.jpg"
            alt="Bio image"
            className="w-32 rounded-full"
          />
        </div>
        <div className="flex grow basis-0 flex-col gap-2">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p>{summary}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a
            class="inline-flex items-center rounded-full bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
            target="_blank"
            rel="noopener"
            href={`https://twitter.com/${twitter}/`}
            aria-label="Share on Twitter"
            draggable="false"
          >
            <svg
              aria-hidden="true"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-6 w-6"
            >
              <title>Twitter</title>
              <path d="m459 152 1 13c0 139-106 299-299 299-59 0-115-17-161-47a217 217 0 0 0 156-44c-47-1-85-31-98-72l19 1c10 0 19-1 28-3-48-10-84-52-84-103v-2c14 8 30 13 47 14A105 105 0 0 1 36 67c51 64 129 106 216 110-2-8-2-16-2-24a105 105 0 0 1 181-72c24-4 47-13 67-25-8 24-25 45-46 58 21-3 41-8 60-17-14 21-32 40-53 55z"></path>
            </svg>
          </a>
          <a
            class="inline-flex items-center rounded-full bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700"
            target="_blank"
            rel="noopener"
            href={`https://twitter.com/${instagram}/`}
            aria-label="Share on Instagram"
            draggable="false"
          >
            {/* [Get from.](https://www.svgrepo.com/svg/497210/instagram) */}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill-opacity="0"
              viewBox="0 0 24 24"
              class="h-6 w-6"
            >
              <title>Instagram</title>
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M17.6361 7H17.6477"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Bio;
