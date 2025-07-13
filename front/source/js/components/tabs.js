import Tabs from "../functions/scripts/tabs.js";

document.addEventListener("DOMContentLoaded", function () {
  window.tabsInstance = new Tabs("[data-tabs-parrent]", "data-tab", "data-tab-content");
});
