const db = require('../../modules/stored_procedures')

module.exports = async function GetServiceProviderByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";
    const contractId = JSON.parse(call.request.JSON).contractId;

    const contract = await db.GetContract(contractId, username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const user_serviceProvider = await db.GetUser(serviceProviderUserName, username);

    const serviceProviderAvatarFileId = user_serviceProvider.avatarFileId;
    const serviceProviderFullName = user_serviceProvider.fullname;
    const serviceProviderRate = user_serviceProvider.rate;

    const avatar = await db.GetFileData(serviceProviderAvatarFileId, username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = Buffer.from(avatar.data).toString("base64");


    callback(null, {
      JSON: JSON.stringify({
        avatar: avatar_base64,
        fullname: serviceProviderFullName,
        rate: serviceProviderRate,
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
