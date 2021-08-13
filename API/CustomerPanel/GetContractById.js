const db = require('../../modules/stored_procedures')

module.exports = async function GetContractById(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";
    const Id = JSON.parse((call.request.JSON)).contractId;
    const contract = await db.GetContract(Id, username);

    if (!contract)
      throw new Error("404");

    const customer = await db.GetCustomer(contract.customer, username);
    const serviceProvider = await db.GetServiceProvider(contract.serviceProvider, username);
    const user_serviceProvider = await db.GetUser(contract.serviceProvider, username);
    const ratings = await db.GetRatingsByCustomerUsername(contract.customer, username);

    const providerRate = ratings.filter((element) => element.provider_username === contract.serviceProvider);
    let rateByThisCustomer;
    if (!ratings.length) {
      rateByThisCustomer = null;
    } else {
      rateByThisCustomer = providerRate[0].rate;
    }

    const providerName = serviceProvider.fullname;
    const providerPhone = serviceProvider.tel;
    const avatar = await db.GetFileData(user_serviceProvider.avatarFileId, username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = Buffer.from(avatar.data).toString("base64");


    let isMyFavotite = false;
    if (providerRate.myFavorite)
      isMyFavotite = true;
    const rate = serviceProvider.rate;
    const contractDetails = contract.description;


    callback(null, {
      JSON: JSON.stringify({
        providerName,
        providerPhone,
        avatar_base64,
        isMyFavotite,
        rate,
        rateByThisCustomer,
        contractDetails,
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
        callback(null, { JSON: JSON.stringify({ StatusCode: 500 }) });
    }
  }

}
