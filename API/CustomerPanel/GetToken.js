const db = require('../../modules/stored_procedures')

module.exports = async function GetToken(call, callback) {
  try {


    callback(null, {
      JSON: JSON.stringify({
        list: "finalResult",
        StatusCode: 200
      })
    });

  } catch (e) {
    switch (e.message) {
      case "400" :
        console.log(e);
        break;
      default  :
        console.log(e);
    }
  }

}
