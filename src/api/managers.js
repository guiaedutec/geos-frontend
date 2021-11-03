import co from "co";
import { getUserToken, createUrlWithParams } from "./utils";

export default function ({ apiURL, managers }) {
  return {
    /*
     * Create a manager
     * @param {object} manager
     * @return {promise} Promise
     */
    create(manager) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${managers.operate}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "POST",
          body: JSON.stringify({ manager }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const createdmanager = yield response.json();

        return Promise.resolve(createdmanager);
      });
    },

    /*
     * Patch a manager
     * @param {object} manager
     * @return {promise} Promise
     */
    patch(manager) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${managers.operate}/${manager._id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "PATCH",
          body: JSON.stringify({ manager }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const updatedManager = yield response.json();

        return Promise.resolve(updatedManager);
      });
    },

    /*
     * Find a manager
     * @param {id} id
     * @return {promise} Promise
     */
    find(id) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${managers.operate}/${id}.json`,
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

        const managerFound = yield response.json();

        return Promise.resolve(managerFound);
      });
    },

    valid_principal(params = { page: 0 }) {
      const requestUrl = createUrlWithParams(
        `${apiURL}/${managers.operate}.json`,
        {
          ...params,
          access_token: getUserToken(),
        }
      );

      return fetch(requestUrl).then((response) => response.json());
    },

    /*
     * Search managers
     */
    search(params = { page: 0 }) {
      const requestUrl = createUrlWithParams(
        `${apiURL}/${managers.operate}.json`,
        {
          ...params,
          access_token: getUserToken(),
        }
      );

      return fetch(requestUrl).then((response) => response.json());
    },

    /*
     * Delete a manager
     * @param {object} manager
     * @return {promise} Promise
     */
    delete(manager) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${managers.operate}/${manager._id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "DELETE",
          body: JSON.stringify({ manager }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const deletedManager = yield response.json();

        return Promise.resolve(deletedManager);
      });
    },
  };
}
