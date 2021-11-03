import co from "co";

export default function ({ apiURL, provinces }) {
  return {
    getProvincesByCountryId(country_id) {
      return co(function* () {
        const response = yield fetch(
          `${apiURL}/${provinces.read}?country_id=${country_id}`
        );
        return (yield response.json()).data;
      });
    },
  };
}
