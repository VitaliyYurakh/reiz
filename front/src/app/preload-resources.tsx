"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  // Preload sprite for icons
  ReactDOM.preload("/img/sprite/sprite.svg?v=4", {
    as: "image",
  });

  // Preload hero images for LCP optimization
  ReactDOM.preload("/img/car/mercedescle1.webp", {
    as: "image",
    fetchPriority: "high",
  });

  // Preload critical local fonts
  ReactDOM.preload("/fonts/HalvarBreit-Md.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return null;
}
