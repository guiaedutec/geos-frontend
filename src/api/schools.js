import co from "co";
import { getUserToken, createUrlWithParams } from "./utils";

export default function ({ apiURL, schools }) {
  return {
    getByIds(
      city_id,
      state_id,
      provincia_id,
      direccion_regional_id,
      type_school,
      complete = false
    ) {
      return co(function* () {
        const response = yield fetch(
          `${apiURL}/${schools.operate}.json?city_id=${city_id}&state_id=${state_id}&provincia_id=${provincia_id}&direccion_regional_id=${direccion_regional_id}&type=${type_school}&compete=${complete}&limit=1000000&sort=name`
        );

        return response.json();
      });
    },

    getAllByCountryId(country_id) {
      return co(function* () {
        const requestUrl = `${apiURL}/${
          schools.operate
        }?country_id=${country_id}&access_token=${getUserToken()}`;
        const response = yield fetch(requestUrl);
        return (yield response.json()).data;
      });
    },

    getAllByIds(country_id, province_id, state_id, city_id) {
      return co(function* () {
        const requestUrl = `${apiURL}/${schools.operate}?country_id=${country_id}&province_id=${province_id}&state_id=${state_id}&city_id=${city_id}`;
        const response = yield fetch(requestUrl);
        return (yield response.json()).data;
      });
    },

    getAllByAffiliationId(affiliation_id) {
      return co(function* () {
        const requestUrl = `${apiURL}/api/v1/schools?affiliation_id=${affiliation_id}`;
        const response = yield fetch(requestUrl);
        return (yield response.json()).data;
      });
    },

    findOne(school_id) {
      return co(function* () {
        if (school_id !== undefined) {
          const requestUrl = `${apiURL}/api/v1/school/${school_id}`;
          const response = yield fetch(requestUrl);
          return (yield response.json()).data;
        }
      });
    },

    update(schoolId, modifierObj) {
      let token = getUserToken();
      let params = {};
      if (token) {
        params = {
          access_token: token,
        };
      }

      const requestUrl = createUrlWithParams(
        `${apiURL}/api/v1/school/edit/${schoolId}`,
        params
      );

      return fetch(requestUrl, {
        method: "POST",
        body: JSON.stringify({ school: { ...modifierObj } }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    },

    /*
     * Find regionals
     * @param {object} school
     * @return {promise} Promise
     */
    findRegionals(params = {}) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${schools.regionals}.json`,
          {
            ...params,
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl);

        return response.json();
      });
    },

    /*
     * Create a school
     * @param {object} school
     * @return {promise} Promise
     */
    create(school) {
      return co(function* () {
        const requestUrl = createUrlWithParams(`${apiURL}/api/v1/school/save`, {
          access_token: getUserToken(),
        });

        const response = yield fetch(requestUrl, {
          method: "POST",
          body: JSON.stringify({ school }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const createdschool = yield response.json();

        return Promise.resolve(createdschool);
      });
    },

    /*
     * Patch a school
     * @param {object} school
     * @return {promise} Promise
     */
    patch(school) {
      return co(function* () {
        const requestUrl = `${apiURL}/api/v1/school/edit/${
          school._id
        }?access_token=${getUserToken()}`;
        console.log(requestUrl);
        const response = yield fetch(requestUrl, {
          method: "POST",
          body: JSON.stringify({ school }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const updatedSchool = yield response.json();

        return Promise.resolve(updatedSchool);
      });
    },

    /*
     * Search schools
     */
    search(params = { page: 0 }) {
      const token = getUserToken();

      const requestUrl = createUrlWithParams(
        `${apiURL}/${schools.operate}.json`,
        {
          ...params,
          access_token: getUserToken(),
        }
      );

      return fetch(requestUrl).then((response) => response.json());
    },

    /*
     * Delete a school
     * @param {object} school
     * @return {promise} Promise
     */
    delete(school) {
      return co(function* () {
        const requestUrl = createUrlWithParams(
          `${apiURL}/${schools.operate}/${school._id}.json`,
          {
            access_token: getUserToken(),
          }
        );

        const response = yield fetch(requestUrl, {
          method: "DELETE",
          body: JSON.stringify({ school }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const deletedItem = yield response.json();

        return Promise.resolve(deletedItem);
      });
    },
  };
}
