import React from "react";
//import { useState, useEffect, useRef } from "react";

function SingleLetter({ color, letterToRender }) {
  let textDecoration = "none";
  let fontWeight = "normal";

  if (color === "red") {
    textDecoration = "underline";
  }

  if (color === "blue" && letterToRender === " ") {
    textDecoration = "underline";
  }

  return (
    <span
      style={{
        color: `${color}`,
        textDecoration: `${textDecoration}`,
        fontWeight: `${fontWeight}`,
        // ...Any sequence of preserved white space always takes up space...
        whiteSpace: `break-spaces`,
      }}
    >
      {letterToRender}
    </span>
  );
}

export default SingleLetter;
