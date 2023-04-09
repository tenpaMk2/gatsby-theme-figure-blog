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

const Playground = () => (
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

    <br />
    <h2 className="text-2xl">Flex wrap height test.</h2>
    <p>Do not set `border` to inline element.</p>
    <div className="w-[500px] bg-violet-200">
      <span className="border border-sky-500">
        Span Span Span Span Span Span
      </span>
      <span className="border border-sky-500 text-8xl">Span Span</span>
      <span className="border border-sky-500 text-8xl">Span Span</span>
      <span className="border border-sky-500">Span</span>
    </div>
    <p>Set `border` to block element.</p>
    <div className="flex w-[500px] flex-wrap items-center bg-violet-200">
      <div className=" border border-sky-500 bg-red-200">
        Div Div Div Div Div Div Div Div Div Div
      </div>
      <div className=" border border-sky-500 bg-green-200 text-8xl">Div</div>
      <div className=" border border-sky-500 bg-blue-200 text-8xl">Div</div>
      <div className=" border border-sky-500 bg-yellow-200">Div</div>
    </div>

    <br />
    <h2 className="text-2xl">
      Flex(row) automatically makes the width full(100%).
    </h2>
    <p>Top level `flex` makes the width full(100%), e.g., red background.</p>
    <div className="flex gap-2 bg-red-200 p-2">
      <div className="bg-sky-200 p-2">
        <p className="bg-yellow-200">
          But, second level `flex` (a flex in a flex) does not make the width
          full.
        </p>
      </div>
      <div className="bg-green-200">green</div>
      <div className="bg-blue-200">blue</div>
    </div>

    <br />
    <h2 className="text-2xl">Burger menu test.</h2>
    <nav role="navigation" className="bg-red-200">
      {/* About `peer` , see [Tailwind CSS doc](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state) . */}
      <input
        type="checkbox"
        className="peer block h-8 w-8 opacity-30"
        id="burger"
      />
      <label htmlFor="burger">
        <p>Click me!! 1</p>
      </label>
      <label htmlFor="burger">
        <p>Click me!! 2</p>
      </label>

      <ul className="absolute hidden w-1/3 min-w-[320px] bg-sky-200 peer-checked:block">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">Aboutooooooooooooooooo</a>
        </li>
        <li>
          <a href="/">Apps</a>
        </li>
      </ul>
    </nav>
    <p>ahoaho1</p>
    <p>ahoaho2</p>
    <p>ahoaho3</p>
    <p>ahoaho4</p>

    <br />
    <h2 className="text-2xl">Animation test.</h2>
    <div className="bg-green-200 p-4">
      <div className="w-min translate-x-0 rounded border-4 border-blue-500 bg-red-200 transition hover:translate-x-12 hover:border-violet-500 hover:bg-yellow-600 hover:text-white">
        Hover me!!
      </div>
      <input type="checkbox" className="peer block h-8 w-8" />
      <div className="invisible absolute block w-24 -translate-x-24 bg-sky-200 opacity-30 transition duration-500 peer-checked:visible peer-checked:block peer-checked:translate-x-0 peer-checked:opacity-100">
        Check above.
      </div>
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
);

export default Playground;

export const Head = () => <body className="bg-red-500" />;
