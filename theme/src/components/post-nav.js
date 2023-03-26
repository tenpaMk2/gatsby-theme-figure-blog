import { Link } from "gatsby";
import React from "react";

const PostNavLink = ({ slug, isNext, title }) => {
  const navMessage = isNext ? `« Next` : `Previous »`;

  return (
    <Link
      to={slug}
      className={`grow basis-0 rounded border border-sky-500 p-2 hover:bg-sky-400 ${
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
    // Need the wrapper div because `justify-center` has an unexpected behavior when overflow.
    // See [StackOverflow](https://stackoverflow.com/questions/34184535/change-justify-content-value-when-flex-items-overflow-container) .
    <div className="min-w-0 basis-full overflow-x-auto">
      <nav className="flex min-w-min justify-center gap-2">
        {next}
        <p className="flex flex-none items-center text-gray-400">●</p>
        {previous}
      </nav>
    </div>
  );
};
