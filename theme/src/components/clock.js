import * as React from "react";

export const Clock = ({ dateFormal, dateMonthAndDay, dateTime, dateYear }) => (
  <time
    dateTime={dateFormal}
    className="flex flex-none flex-col justify-center text-center"
  >
    <p className="text-lg text-gray-400">{dateYear}</p>
    <p className="mb-2 text-2xl">{dateMonthAndDay}</p>
    <p className="text-sm text-gray-400">{dateTime}</p>
  </time>
);
