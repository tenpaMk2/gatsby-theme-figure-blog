import React from "react";
import svg from "../images/bio.svg";

/**
 * Bio icon that is SVG image surrounded white circle.
 * If you want to change SVG, shadow the SVG.
 * If you want to change the background shape, color, or etcetc, shadow this file.
 * @returns {JSX.Element}
 */
export const BioIcon = () => (
  <div className="rounded-full bg-white">
    <img alt="Bio icon" src={svg} />
  </div>
);
