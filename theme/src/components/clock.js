import React from "react";
import { queryBlogConfig } from "../libs/query-blog-config.mjs";

const isInvalidDate = (date) => Number.isNaN(date.getTime());
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

export const Clock = ({ date }) => {
  const d = new Date(date);

  if (isInvalidDate(d)) return null;

  const { locale, intlYear, intlMonthAndDate, intlTime } = queryBlogConfig();

  const year = isEmptyObject(intlYear) ? null : (
    <p className="text-base text-gray-400 md:text-lg">
      {new Intl.DateTimeFormat(locale, intlYear).format(d)}
    </p>
  );

  const monthAndDate = isEmptyObject(intlMonthAndDate) ? null : (
    <p className="text-base md:text-2xl">
      {new Intl.DateTimeFormat(locale, intlMonthAndDate).format(d)}
    </p>
  );

  const time = isEmptyObject(intlTime) ? null : (
    <p className="text-sm text-gray-400">
      {new Intl.DateTimeFormat(locale, intlTime).format(d)}
    </p>
  );

  return (
    <time
      dateTime={d.toISOString()}
      className="flex flex-none flex-col justify-center text-center"
    >
      {year}
      {monthAndDate}
      {time}
    </time>
  );
};
