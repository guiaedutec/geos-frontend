import co from "co";

export default function ({ apiURL, states }) {
  return {
    getAllByIds(country_id, province_id) {
      return co(function* () {
        const response = yield fetch(
          `${apiURL}/${states.read}?country_id=${country_id}&province_id=${province_id}`
        );
        return (yield response.json()).data;
      });
    },
  };
}
