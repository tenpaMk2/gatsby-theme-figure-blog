import * as React from "react";

export const Clock = ({ dateFormal, dateMonthAndDay, dateTime, dateYear }) => (
  <time
    dateTime={dateFormal}
    className="flex flex-none flex-col justify-center text-center"
  >
    <p className="text-base text-gray-400 md:text-lg">{dateYear}</p>
    <p className="text-base md:text-2xl">{dateMonthAndDay}</p>
    <p className="text-sm text-gray-400">{dateTime}</p>
  </time>
);
