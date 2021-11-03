import co from "co";

export default function ({ apiURL, cities }) {
  return {
    getAllByIds(country_id, province_id, state_id) {
      return co(function* () {
        const response = yield fetch(
          `${apiURL}/${cities.read}?country_id=${country_id}&province_id=${province_id}&state_id=${state_id}`
        );

        return (yield response.json()).data;
      });
    },
  };
}
