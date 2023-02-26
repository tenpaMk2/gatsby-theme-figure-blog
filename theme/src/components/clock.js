import * as React from "react";

export const Clock = ({ dateFormal, dateMonthAndDay, dateTime, dateYear }) => {
  const year = dateYear ? (
    <p className="text-base text-gray-400 md:text-lg">{dateYear}</p>
  ) : null;
  const time = dateTime ? (
    <p className="text-sm text-gray-400">{dateTime}</p>
  ) : null;

  return (
    <time
      dateTime={dateFormal}
      className="flex flex-none flex-col justify-center text-center"
    >
      {year}
      <p className="text-base md:text-2xl">{dateMonthAndDay}</p>
      {time}
    </time>
  );
};
