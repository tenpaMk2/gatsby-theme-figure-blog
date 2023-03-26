import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { SidebarItemLayout } from "./sidebar-item-layout";
import { Twitter } from "./svgs/twitter";
import { Instagram } from "./svgs/instagram";
import { GitHub } from "./svgs/github";
import { BioIcon } from "./bio-icon";

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

  const twitterIcon = siteMetadata?.social?.twitter ? (
    <IconLink
      key="twitter"
      label="Twitter"
      href={`https://twitter.com/${siteMetadata.social.twitter}/`}
    >
      <Twitter />
    </IconLink>
  ) : null;

  const instagramIcon = siteMetadata?.social?.instagram ? (
    <IconLink
      key="instagram"
      label="Instagram"
      href={`https://www.instagram.com/${siteMetadata.social.instagram}/`}
    >
      <Instagram />
    </IconLink>
  ) : null;

  const githubIcon = siteMetadata?.social?.github ? (
    <IconLink
      key="github"
      label="GitHub"
      href={`https://github.com/${siteMetadata.social.github}/`}
    >
      <GitHub />
    </IconLink>
  ) : null;

  const socials = [twitterIcon, instagramIcon, githubIcon].filter(
    (social) => social
  );
  const socialWrapper = socials.length ? (
    <div className="flex flex-wrap justify-center gap-2">{socials}</div>
  ) : null;

  return (
    <SidebarItemLayout title="Bio">
      <div className="flex min-w-min flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          <BioIcon />
          <h2 className="text-center text-2xl font-bold">{name}</h2>
        </div>
        <p className="">{summary}</p>
        {socialWrapper}
      </div>
    </SidebarItemLayout>
  );
};
