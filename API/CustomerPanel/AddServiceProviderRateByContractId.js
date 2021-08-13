const db = require('../../modules/stored_procedures')
const calculateAvgRate = require('./Utils').calculateAvgRate

module.exports = async function AddServiceProviderRateByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";

    const {
      contractId,
      rate,
      description
    } = JSON.parse(call.request.JSON);
    if (rate > 5 && rate < 0) {
      throw new Error("400");
    }
    let contract = await db.GetContract(contractId, username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    const data = await db.GetRatingsByCustomerUsername(customerUserName, username);

    const check = data.every((element) => {

      if (element.provider_username === serviceProviderUserName)
        return false;

    });
    if (!check)
      throw new Error("405");

    let newRate;
    const avgRate = await calculateAvgRate(serviceProviderUserName, rate, username);
    if (!avgRate)
      newRate = rate;
    else
      newRate = avgRate;

    await db.RegisterRate(customerUserName, serviceProviderUserName, newRate, description, username);


    callback(null, { JSON: JSON.stringify({ StatusCode: 201 }) });

  } catch (e) {
    switch (e.message) {
      case "405" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 405 }) });
        break;
      case "400" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 400 }) });
        break;
      default  :
        callback(null, { JSON: JSON.stringify({ Status: 500 }) });
    }
  }


}
