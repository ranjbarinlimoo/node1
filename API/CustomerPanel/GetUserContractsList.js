const db = require('../../modules/stored_procedures')

module.exports = async function GetUserContractsList(call, callback) {
  try {
    const username = JSON.parse((call.request.JSON)).UserName;
    let result = await db.GetContractByCustomerUsername(username, username);

    if (!result.length)
      throw new Error("404");

    let finalResult = [];
    result.forEach((element) => {

      let newResult = {};
      newResult.id = element.id;
      newResult.description = element.description;
      newResult.price = element.price;
      result = finalResult.push(newResult);

    });


    callback(null, {
      JSON: JSON.stringify({
        list: finalResult,
        StatusCode: 200
      })
    });

  } catch (e) {
    switch (e.message) {
      case "404" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 404 }) });
        break;
      case "400" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 400 }) });
        break;
      default  :
        callback(null, { JSON: JSON.stringify({ Status: 500 }) });
    }
  }

}
