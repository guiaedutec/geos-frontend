import co from "co";

export default function ({ apiURL }) {
  return {
    getAll() {
      return co(function* () {
        const response = yield fetch(`${apiURL}/api/v1/langs`);

        return response.json();
      });
    },
  };
}
