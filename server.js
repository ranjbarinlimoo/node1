const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const env = require("dotenv").config();

const db = require("./modules/stored_procedures/");

const packageDefinition = protoLoader.loadSync("./prototypes/ranjbar.proto", {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const pkg = grpc.loadPackageDefinition(packageDefinition).Frontend;


async function startServer() {
  let server = new grpc.Server();
  server.addService(pkg.CustomerPanel.service, {
    GetUserContractsList,
    GetContractById,
    GetServiceProviderByContractId,
    AddServiceProviderRateByContractId,
    EditMyFavoritesByContractId,
    IsMyFavoriteByContractId
  });
  server.bindAsync(process.env.GRPS_SERVER_HOST + ":" + process.env.GRPS_SERVER_PORT, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

startServer();


async function GetUserContractsList(call, callback) {
  try {
    const username = JSON.parse((call.request.JSON)).UserName;
    let result = await db.GetContractByCustomerUsername(username, username);

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
        data: finalResult,
        StatusCode: 200
      })
    });

  } catch (e) {
    switch (e.message) {
      case "400" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 400 }) });
        break;
      default  :
        callback(null, { JSON: JSON.stringify({ Status: 500 }) });
    }
  }

}

async function GetContractById(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";
    const Id = JSON.parse((call.request.JSON)).contractId;
    const contract = await db.GetContract(Id, username);
    const customer = await db.GetCustomer(contract.customer, username);
    const serviceProvider = await db.GetServiceProvider(contract.serviceProvider, username);
    const user_serviceProvider = await db.GetUser(contract.serviceProvider, username);
    const ratings = await db.GetRatingsByCustomerUsername(contract.customer, username);

    const providerRate = ratings.filter((element)=> element.provider_username === contract.serviceProvider)
    let rateByThisCustomer
    if (!ratings.length){
      rateByThisCustomer = null;
    }else {
      rateByThisCustomer = providerRate[0].rate
    }

    const providerName = serviceProvider.fullname;
    const providerPhone = serviceProvider.tel;
    const avatar = await db.GetFileData(user_serviceProvider.avatarFileId, username);
    const avatar_base64 = Buffer.from(avatar.data).toString("base64");
    let isMyFavotite = false
    if (providerRate.myFavorite)
      isMyFavotite = true
    const rate = serviceProvider.rate;
    const contractDetails = contract.description;

    let finalResult = {
      providerName,
      providerPhone,
      avatar_base64,
      isMyFavotite,
      rate,
      rateByThisCustomer,
      contractDetails,
      StatusCode: 200
    };

    callback(null, { JSON: JSON.stringify({ data: finalResult }) });

  } catch (e) {
    callback(null, { JSON: JSON.stringify({ StatusCode: 500 }) });
  }

}

async function GetServiceProviderByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";
    const contractId = JSON.parse(call.request.JSON).contractId;

    const contract = await db.GetContract(contractId, username);
    const serviceProviderUserName = contract.serviceProvider;
    const user_serviceProvider = await db.GetUser(serviceProviderUserName, username);

    const serviceProviderAvatarFileId = user_serviceProvider.avatarFileId;
    const serviceProviderFullName = user_serviceProvider.fullname;
    const serviceProviderRate = user_serviceProvider.rate;

    const avatar = await db.GetFileData(serviceProviderAvatarFileId, username);
    const avatar_base64 = Buffer.from(avatar.data).toString("base64");


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
      case "400" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 400 }) });
        break;
      default  :
        callback(null, { JSON: JSON.stringify({ Status: 500 }) });
    }
  }
}

async function AddServiceProviderRateByContractId(call, callback) {
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

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    const data = await db.GetRatingsByCustomerUsername(customerUserName, username);

    const check = data.every((element) => {

      if (element.provider_username === serviceProviderUserName)
        return false;

    });
    if (!check)
      throw new Error("400");

    await db.RegisterRate(customerUserName, serviceProviderUserName, rate, description, username);


    callback(null, { JSON: JSON.stringify({ StatusCode: 201 }) });

  } catch (e) {
    switch (e.message) {
      case "400" :
        callback(null, { JSON: JSON.stringify({ StatusCode: 400 }) });
        break;
      default  :
        callback(null, { JSON: JSON.stringify({ Status: 500 }) });
    }
  }


}

async function EditMyFavoritesByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";

    const {
      contractId,isMyFavorite
    } = JSON.parse(call.request.JSON);

    let contract = await db.GetContract(contractId, username);

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    if (!rating.length){
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, '', username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    }
    rating = rating[0]

    await db.UpdateRate(rating.rateid,rating.rate,rating.description,isMyFavorite,username)

    callback(null, { JSON: JSON.stringify({ StatusCode: 200 }) });

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

async function IsMyFavoriteByContractId(call, callback) {
  try {
    const username = "testUser_backEnd_Ranjbar";

    const {
      contractId
    } = JSON.parse(call.request.JSON);

    let contract = await db.GetContract(contractId, username);

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    if (!rating.length){
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, '', username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, username);
    }
    rating = rating[0]

    let isMyFavorite
    if(rating.myFavorite){
      isMyFavorite=true
    }else {
      isMyFavorite=false
    }



    callback(null, { JSON: JSON.stringify({ isMyFavorite,StatusCode: 200 }) });

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
