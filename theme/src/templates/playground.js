import React from "react";

const Card = ({ isPortrait, children }) => (
  <a
    href="/"
    className="min-w-0 max-w-lg grow basis-[320px] overflow-hidden rounded bg-slate-700 hover:bg-sky-800"
  >
    <article
      className={`flex aspect-square h-full w-full min-w-0 bg-violet-500 ${
        isPortrait ? `flex-row` : `flex-col`
      }`}
    >
      <div className="basis-[56.25%] bg-slate-400">img</div>
      <header
        className={`flex min-h-0 min-w-0 basis-[43.75%] gap-2 p-2 ${
          isPortrait ? `flex-col` : `flex-row`
        }`}
      >
        <div className="bg-yellow-200">clock</div>
        <div className="flex content-center overflow-auto bg-red-200">
          <div className="my-auto">
            <h1 className="flex items-center">{children}</h1>
          </div>
        </div>
      </header>
    </article>
  </a>
);

const PlaygroundTemplate = () => (
  <div className="overflow-auto bg-slate-100">
    <h1 className="text-4xl font-bold">Playground</h1>
    <h2 className="text-2xl">Basics.</h2>
    <p>This page is wrapped by `div` tag with `overflow-auto bg-slate-100` .</p>
    <p>`body` has `bg-red-500` . If you see red area, something was wrong.</p>
    <br />

    <br />
    <h2 className="text-2xl">
      Width is automatically expanded in `flex-col` .
    </h2>
    <div className="flex flex-wrap">
      <div className="flex basis-full flex-col bg-sky-300">
        <span className="bg-green-300">
          This is a `span` tag without `w-full` inside `flex-col` .
        </span>
        <div className="bg-red-300">
          This is a `div` tag without `w-full` inside `flex-col` .
        </div>
      </div>
    </div>

    <br />
    <h2 className="text-2xl">`aspect-ratio` cannot hold the height.</h2>
    <div className="aspect-square w-48 bg-red-200">
      This is `div` tag with `aspect-square w-48` . If text become long, the
      height is expand. Try `overflow-auto` . Can you see? Can you see? Can you
      see? Can you see? Can you see? Can you see? Can you see? Can you see? Can
      you see? Can you see? Can you see? Can you see? Can you see? Can you see?
      Can you see? Can you see?
    </div>

    <br />
    <h2 className="text-2xl">Card layout test.</h2>
    <p>
      The container `max-width` is 1280px. Try narrowing the screen by
      Chrome-debugger.
    </p>
    <div className="flex max-w-[1280px] flex-wrap gap-2 text-xl">
      <Card isPortrait={true}>
        `basis-[43.75%]` . Don't set `gap-*` at the card container. Long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long text.
      </Card>
      <Card isPortrait={false}>
        `basis-[43.75%]` . Don't set `gap-*` at the card container. Long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long
        long long text.
      </Card>
      <Card isPortrait={true}>Short text must be placed at top.</Card>
      <Card isPortrait={false}>Short text must be placed at middle.</Card>
      <Card isPortrait={true}>
        Very
        longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongword.
      </Card>
      <Card isPortrait={false}>
        Very
        longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglongword.
      </Card>
    </div>
  </div>
);

export const Head = () => <body className="bg-red-500" />;

export default PlaygroundTemplate;
