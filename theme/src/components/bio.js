import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { SidebarItemLayout } from "./sidebar-item-layout";
import { Twitter } from "./svgs/twitter";
import { Instagram } from "./svgs/instagram";
import { GitHub } from "./svgs/github";
import bioSvg from "../images/bio.svg";

const IconLink = ({ label, href, children }) => (
  <a
    aria-label={label}
    className="block h-12 w-12 rounded-full bg-sky-500 p-2 text-white transition duration-200 hover:bg-sky-400"
    target="_blank"
    rel="noopener"
    href={href}
    draggable="false"
  >
    {children}
  </a>
);

export const Bio = () => {
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
    <SidebarItemLayout title="Bio">
      <div className="flex min-w-min flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="rounded-full bg-white">
            <img src={bioSvg} />
          </div>
          <h2 className="text-center text-2xl font-bold">{name}</h2>
        </div>
        <p className="">{summary}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <IconLink label="Twitter" href={`https://twitter.com/${twitter}/`}>
            <Twitter />
          </IconLink>
          <IconLink
            label="Instagram"
            href={`https://www.instagram.com/${instagram}/`}
          >
            <Instagram />
          </IconLink>
          <IconLink label="GitHub" href={`https://github.com/${github}/`}>
            <GitHub />
          </IconLink>
        </div>
      </div>
    </SidebarItemLayout>
  );
};
