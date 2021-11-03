import co from 'co';

export default function({apiURL, spreadsheets}){
  return {
    getAll(){
      return co(function *(){
        const response = yield fetch(`${apiURL}/${spreadsheets.read}`);

        return response.json();
      });
    }, 

    findOne(schoolId){
      return co(function *(){
        const response = yield fetch(`${apiURL}/${spreadsheets.operate}/${schoolId}`);

        return response.json();
      });
    },
  };
}
