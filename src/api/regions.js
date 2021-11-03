import co from "co";

export default function ({ apiURL, regions }) {
  return {
    getAll() {
      return co(function* () {
        const response = yield fetch(`${apiURL}/${regions.read}`);

        return response.json();
      });
    },
  };
}
