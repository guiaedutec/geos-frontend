import co from "co";

export default function ({ apiURL, translations }) {
  return {
    getAll(lang) {
      return co(function* () {
        const response = yield fetch(`${apiURL}/${translations.read}/${lang}`);
        return (yield response.json()).data[0];
      });
    },
  };
}
