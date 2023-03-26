import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  PinterestIcon,
  PinterestShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WeiboIcon,
  WeiboShareButton,
} from "react-share";
import noImage from "../images/no-image.png";

export const ShareButtons = ({ imageSrc, location, title }) => {
  const url = `${location.origin}${location.pathname}`;
  const options = { size: 48, round: true };
  const media = imageSrc || `${location.origin}${noImage}`;

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      <FacebookShareButton {...{ url }}>
        <FacebookIcon {...options} />
      </FacebookShareButton>
      <TwitterShareButton {...{ url, title }}>
        <TwitterIcon {...options} />
      </TwitterShareButton>
      <LineShareButton {...{ url, title }}>
        <LineIcon {...options} />
      </LineShareButton>
      <HatenaShareButton {...{ url, title }}>
        <HatenaIcon {...options} />
      </HatenaShareButton>
      <PinterestShareButton {...{ media, url }}>
        <PinterestIcon {...options} />
      </PinterestShareButton>
      <PocketShareButton {...{ url, title }}>
        <PocketIcon {...options} />
      </PocketShareButton>
      <RedditShareButton {...{ url, title }}>
        <RedditIcon {...options} />
      </RedditShareButton>
      <WeiboShareButton {...{ url, title }} image={media}>
        <WeiboIcon {...options} />
      </WeiboShareButton>
    </div>
  );
};
