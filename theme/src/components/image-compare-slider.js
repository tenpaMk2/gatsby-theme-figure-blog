import React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

/** Image compare slider component. */
const imgStyle = {
  margin: 0,
  padding: 0,
};

/**
 * Image compare slider component.
 * @param {Object} left - Left image properties.
 * @param {Object} right - Right image properties.
 * @returns {Object} ReactCompareSlider.
 */
export const ImageCompareSlider = ({ left, right }) => (
  <ReactCompareSlider
    itemOne={
      <ReactCompareSliderImage
        src={left.src}
        srcSet={left.srcSet}
        alt={left.alt}
        title={left.title}
        style={imgStyle}
      />
    }
    itemTwo={
      <ReactCompareSliderImage
        src={right.src}
        srcSet={right.srcSet}
        alt={right.alt}
        title={right.title}
        style={imgStyle}
      />
    }
  />
);
