import co from "co";
import { getUserToken } from "~/api/utils";

export default function ({ apiURL, countries }) {
  return {
    getAll() {
      return co(function* () {
        let URL_REQUEST = `${apiURL}/${countries.read}`;
        if (getUserToken()) {
          URL_REQUEST += `?access_token=${getUserToken()}`;
        }
        const response = yield fetch(URL_REQUEST);
        return (yield response.json()).data;
      });
    },
  };
}
