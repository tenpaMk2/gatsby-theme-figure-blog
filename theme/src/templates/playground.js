import React from "react";

const PlaygroundTemplate = () => (
  <>
    <h1 className="text-4xl font-bold">Playground</h1>

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

    <h2 className="text-2xl">`aspect-ratio` cannot hold the height.</h2>
    <div className="aspect-square w-48 bg-red-200">
      This is `div` tag with `aspect-square w-48` . This is `div` tag with
      `aspect-square w-48` . This is `div` tag with `aspect-square w-48` . This
      is `div` tag with `aspect-square w-48` . This is `div` tag with
      `aspect-square w-48` . This is `div` tag with `aspect-square w-48` . This
      is `div` tag with `aspect-square w-48` . This is `div` tag with
      `aspect-square w-48` . This is `div` tag with `aspect-square w-48` .
    </div>

    <h2 className="text-2xl">Card layout test.</h2>
    <p>
      The container `max-width` is 1280px. Try narrowing the screen by
      Chrome-debugger.
    </p>
    <div className="flex max-w-[1280px] flex-wrap gap-2 text-xl">
      <div className="flex aspect-square grow basis-[320px] flex-row bg-red-300">
        <div className="basis-[56.25%] bg-slate-300">`basis-[56.25%]` .</div>
        <p className="basis-[43.75%] overflow-auto">
          `basis-[43.75%]` . Long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long text.
        </p>
      </div>
      <div className="flex aspect-square grow basis-[320px] flex-col bg-sky-300">
        <div className="basis-[56.25%] bg-slate-400">img</div>
        <p className="basis-[43.75%] overflow-auto">
          Long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long text.
        </p>
      </div>
      <div className="flex aspect-square grow basis-[320px] flex-row bg-green-300">
        <div className="basis-[56.25%] bg-slate-300">img</div>
        <p className="basis-[43.75%] overflow-auto">
          Long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long long long long long long long long long long long
          long long long long text.
        </p>
      </div>
    </div>
  </>
);

export default PlaygroundTemplate;
