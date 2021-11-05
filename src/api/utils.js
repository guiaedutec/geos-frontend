import $ from "jquery";

export const USER_TOKEN_KEY = "@@api/USER_TOKEN";

export function setUserToken(token) {
  localStorage.setItem(USER_TOKEN_KEY, token);
}

export function getUserToken() {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function setUserId(userId) {
  localStorage.setItem("userId", userId);
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function removeUserToken() {
  return localStorage.removeItem(USER_TOKEN_KEY);
}

export function createUrlWithParams(uri, params) {
  return `${uri}?${$.param(params)}`;
}

export function getLang() {
  return localStorage.getItem("lang");
}

export function getUrlParamString(field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
}
