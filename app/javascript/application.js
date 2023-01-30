// NOTE: I am using Typescript and tsx files here. Change for your setup.
import * as Components from "./components/**/*.tsx";
import "./jquery";

let componentsContext = {};
Components.filenames.forEach((fileName, i) => {
  let cleanName = fileName.replace("./components/", "").replace(".tsx", "");
  componentsContext[cleanName] = Components.default[i].default;
});

const ReactRailsUJS = require("react_ujs");
console.log(ReactRailsUJS);

ReactRailsUJS.getConstructor = (name) => {
  return componentsContext[name];
};
ReactRailsUJS.handleEvent("turbo:load", ReactRailsUJS.handleMount, false);
ReactRailsUJS.handleEvent("turbo:frame-load", ReactRailsUJS.handleMount, false);
ReactRailsUJS.handleEvent(
  "turbo:before-render",
  ReactRailsUJS.handleUnmount,
  false
);
