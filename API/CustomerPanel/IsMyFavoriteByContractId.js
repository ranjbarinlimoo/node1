const db = require('../../modules/stored_procedures')

module.exports = async function IsMyFavoriteByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";

    const {
      contractId
    } = JSON.parse(call.request.JSON);

    let contract = await db.GetContract(contractId, username);
    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    if (!rating.length) {
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, "", username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    }
    rating = rating[0];

    let isMyFavorite;
    if (rating.myFavorite) {
      isMyFavorite = true;
    } else {
      isMyFavorite = false;
    }


    callback(null, {
      JSON: JSON.stringify({
        isMyFavorite,
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
