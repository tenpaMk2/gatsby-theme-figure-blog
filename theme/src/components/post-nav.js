import { Link } from "gatsby";
import * as React from "react";

const PostNavLink = ({ slug, isNext, title }) => {
  const navMessage = isNext ? `« Next` : `Previous »`;

  return (
    <Link
      to={slug}
      className={`grow basis-0 rounded p-2 hover:bg-sky-600 ${
        isNext ? `text-right` : `text-left`
      }`}
    >
      <p className="text-xl text-white/30">{navMessage}</p>
      <p className="text-white/60">{title}</p>
    </Link>
  );
};

export const PostNav = ({
  previousSlug,
  previousTitle,
  nextSlug,
  nextTitle,
}) => {
  const next = nextSlug ? (
    <PostNavLink slug={nextSlug} isNext={true} title={nextTitle} />
  ) : (
    <div className="grow basis-0" /> // dummy
  );

  const previous = previousSlug ? (
    <PostNavLink slug={previousSlug} isNext={false} title={previousTitle} />
  ) : (
    <div className="grow basis-0" /> // dummy
  );

  return (
    <nav className="flex basis-full justify-center gap-2">
      {next}
      <p className="flex flex-none items-center text-gray-600">●</p>
      {previous}
    </nav>
  );
};
