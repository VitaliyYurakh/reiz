"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  ReactDOM.preload("/img/sprite/sprite.svg?v=4", {
    as: "image",
  });

  return null;
}
