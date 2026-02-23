"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  // Preload sprite for icons (low priority - not LCP critical)
  ReactDOM.preload("/img/sprite/sprite.svg?v=4", {
    as: "image",
  });

  // Hero images are already preloaded in layout.tsx <head>
  // Don't duplicate preload here

  return null;
}
