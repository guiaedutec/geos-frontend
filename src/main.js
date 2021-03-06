/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright ¬© 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
// import FastClick from 'fastclick';
import { Provider } from "react-redux";
import { addLocaleData, IntlProvider } from "react-intl";
import parse from "html-react-parser";

import { flattenMessages } from "./i18n/utils";
import NProgress from "nprogress";

import store from "./core/store";
import router from "./core/router";
import history from "./core/history";

import "!style!css!nprogress/nprogress.css";
import "!style!css!sass!./bulma-variables.scss";
import "./variables.styl";
import "!style!css!stylus!./main.styl";

import "~/startup";

import LangConfig from "./components/LangConfig";

let routes = require("./routes.json"); // Loaded with utils/routes-loader.js
const container = document.getElementById("container");

function renderComponent(component) {
  NProgress.done();
  ReactDOM.render(
    <LangConfig>
      <Provider store={store}>{component}</Provider>
    </LangConfig>,
    container
  );
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  NProgress.start();
  router
    .resolve(routes, location)
    .then(renderComponent)
    .catch((error) =>
      router.resolve(routes, { ...location, error }).then(renderComponent)
    );
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
// FastClick.attach(document.body);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept("./routes.json", () => {
    routes = require("./routes.json"); // eslint-disable-line global-require
    render(history.getCurrentLocation());
  });
}
