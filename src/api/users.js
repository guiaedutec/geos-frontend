import co from "co";
import {
  getLang,
  getUserToken,
  setUserToken,
  setUserId,
  removeUserToken,
  createUrlWithParams,
} from "./utils";

/* eslint-disable camelcase */

export default function ({ apiURL, users }) {
  // Private variables
  let currentUser = {};

  return {
    get currentUser() {
      return currentUser;
    },

    get hasUserToken() {
      return getUserToken();
    },

    /*
     * Create a user
     * @param {object} user
     * @return {promise} Promise
     */
    create(user, notToLogin = false, noaff = false) {
      return co(function* () {
        const requestUrl = `${apiURL}/${users.operate}?noaff=${noaff}`;
        if (getUserToken()) {
          const requestUrl = createUrlWithParams(
            `${apiURL}/${users.operate}?noaff=${noaff}`,
            {
              access_token: getUserToken(),
            }
          );
        }

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const response = yield fetch(requestUrl, {
          method: "POST",
          body: JSON.stringify({ user }),
          headers: headers,
        });

        const createdUser = yield response.json();

        return Promise.resolve(createdUser);
      });
    },

    uploadTerm(file, authenticity_token) {
      return co(function* () {
        const requestUrl = `${apiURL}/api/v1/upload_term?access_token=${authenticity_token}`;

        const response = yield fetch(requestUrl, {
          method: "POST",
          body: file,
        });

        const fileUploaded = yield response.json();
        return Promise.resolve(fileUploaded);
      });
    },

    /* Attempts to login a user with a stored token
     * @returns {Promise} User object or false resolved
     */
    loginWithToken(loginToken) {
      return co(function* () {
        const token = loginToken || getUserToken();

        if (!token || token == "undefined") return Promise.resolve({});

        const response = yield fetch(`${apiURL}/${users.signIn}`, {
          method: "POST",
          /* eslint-disable camelcase*/
          body: JSON.stringify({ access_token: token }),
          /* eslint-enable camelcase*/
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const user = yield response.json();
        currentUser = user;

        setUserToken(user.authenticity_token);
        setUserId(user._id.$oid);

        return Promise.resolve(user);
      });
    },

    login(credentials) {
      return co(function* () {
        const response = yield fetch(`${apiURL}/${users.signIn}`, {
          method: "POST",
          body: JSON.stringify({ user: credentials }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const user = yield response.json();

        if (!user._id) {
          if (user.email && user.password === null) {
            throw new Error("Login Error");
          }
        }

        currentUser = user;
        setUserToken(user.authenticity_token);
        setUserId(user._id.$oid);
        // console.log(user);
        return user;
      });
    },

    logout() {
      currentUser = null;
      removeUserToken();
    },

    /**
     * Send instructions of new password
     */
    forgotPassword(email) {
      return co(function* () {
        const response = yield fetch(`${apiURL}/${users.forgotPassword}`, {
          method: "POST",
          body: JSON.stringify({ user: email, lang: getLang() }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const forgotPassword = yield response.json();
        return Promise.resolve(forgotPassword);
      });
    },

    /**
     * Send new password
     */
    resetPassword(newCredentials) {
      return co(function* () {
        const { reset_password_token, password } = newCredentials;
        const response = yield fetch(`${apiURL}/${users.resetPassword}`, {
          method: "PATCH",
          body: JSON.stringify({
            user: {
              password,
              reset_password_token,
            },
            lang: getLang()
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const user = yield response.json();
        return Promise.resolve(user);
      });
    },

    /*
     * Find a user
     * @param {id} id
     * @return {promise} Promise
     */
    find(id) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${users.operate}/${id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const userFound = yield response.json();

        return Promise.resolve(userFound);
      });
    },

    /*
     * Patch a user
     * @param {object} user
     * @return {promise} Promise
     */
    patch(user) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${users.operate}/${user._id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "PATCH",
          body: JSON.stringify({ user }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const updatedUser = yield response.json();

        return Promise.resolve(updatedUser);
      });
    },

    /*
     * Search Users
     */
    search(params = { page: 0 }) {
      const requestUrl = createUrlWithParams(
        `${apiURL}/${users.operate}.json`,
        {
          ...params,
          access_token: getUserToken(),
        }
      );

      return fetch(requestUrl).then((response) => response.json());
    },

    /*
     * Delete a user
     * @param {object} user
     * @return {promise} Promise
     */
    delete(user) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${users.operate}/${user._id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "DELETE",
          body: JSON.stringify({ user }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const deletedItem = yield response.json();

        return Promise.resolve(deletedItem);
      });
    },

    /**
     * Change password
     */
    changePassword(newCredentials) {
      return co(function* () {
        const { password } = newCredentials;
        const response = yield fetch(`${apiURL}/${users.changePassword}`, {
          method: "PATCH",
          body: JSON.stringify({
            access_token: getUserToken(),
            user: {
              password,
            },
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const user = yield response.json();
        return Promise.resolve(user);
      });
    },

    /**
     * Change user password by admin
     */
    changeUserPasswordByAdmin(newCredentials) {
      let requestUrl = "";

      if (getUserToken()) {
        requestUrl = createUrlWithParams(
          `${apiURL}/${users.changeUserPasswordByAdmin}`,
          {
            access_token: getUserToken(),
          }
        );
      }

      return co(function* () {
        const response = yield fetch(requestUrl, {
          method: "PATCH",
          body: JSON.stringify(newCredentials),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const user = yield response.json();
        return Promise.resolve(user);
      });
    },
  };
}
