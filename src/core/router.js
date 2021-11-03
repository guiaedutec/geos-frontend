/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright ¬© 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import { loginWithToken } from "../actions/accounts";
import { setUserToken } from "../api/utils";

function decodeParam(val) {
  if (!(typeof val === "string" || val.length === 0)) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }

    throw err;
  }
}

function getUrlParams(url) {
  const s = url.slice(1); // removes the beginning "?"
  const keyValuePairs = s.split("&");
  let keyValue = [];
  const params = {};
  for (const pair of keyValuePairs) {
    keyValue = pair.split("=");
    params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
  }
  return params;
}

// Match the provided URL path pattern to an actual URI string. For example:
//   matchURI({ path: '/posts/:id' }, '/dummy') => null
//   matchURI({ path: '/posts/:id' }, '/posts/123') => { id: 123 }
function matchURI(route, path, queryParams = "") {
  let params;
  const match = route.pattern.exec(path);

  if (!match) {
    return null;
  }

  if (queryParams !== "") {
    params = getUrlParams(queryParams);
  } else {
    params = Object.create(null);
  }

  for (let i = 1; i < match.length; i++) {
    params[route.keys[i - 1].name] =
      match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }

  return params;
}

// Find the route matching the specified location (context), fetch the required data,
// instantiate and return a React component
function resolve(routes, context) {
  for (const route of routes) {
    const params = matchURI(
      route,
      context.error ? "/error" : context.pathname,
      context.search
    );

    if (!params) {
      continue;
    }
    if (params && "access_token" in params) {
      console.log("params.access_token", params.access_token);
      setUserToken(params.access_token);
    }

    // TODO: Fetch data required data for the route. See "routes.json" file in the root directory.
    return route
      .load()
      .then((Page) => <Page.default route={route} error={context.error} />);
  }

  const error = new Error("Page not found");
  error.status = 404;
  return Promise.reject(error);
}

export default { resolve };
