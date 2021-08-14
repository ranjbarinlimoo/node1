
const express = require("express");
const env = require("dotenv").config();
const chalk = require("chalk");
const db = require("./modules/stored_procedures/");

const middleware = (req, res, next) => {

  req.username = "testUser_backEnd_Ranjbar";

  next();

};

const app = express();
app.use(express.json());

app.listen(8081,()=>{

  console.log(chalk.blue.bold('Express Server Listening On Port: '+8081));

})


// const username = "testUser_backEnd_Ranjbar";
// {
//   parameters: {
//      UserName:'moharrami',
//      ... ,
//   }
// }

// {
//   result: {
//
//   },
//   status: 200,
//     message: 'something'
// }

app.get("/GetUserContractsList", middleware, async (req, res) => {
  try {
    const username = req.body.parameters.UserName;
    let result = await db.GetContractByCustomerUsername(username, req.username);

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

    res.send({
      result: finalResult,
      message: "OK"
    });


  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Username Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }

});

app.get("/GetContractById", middleware, async (req, res) => {
  try {

    const Id = req.body.parameters.contractId;
    const contract = await db.GetContract(Id, req.username);

    if (!contract)
      throw new Error("404");

    const customer = await db.GetCustomer(contract.customer, req.username);
    const serviceProvider = await db.GetServiceProvider(contract.serviceProvider, req.username);
    const user_serviceProvider = await db.GetUser(contract.serviceProvider, req.username);
    const ratings = await db.GetRatingsByCustomerUsername(contract.customer, req.username);

    const providerRate = ratings.filter((element) => element.provider_username === contract.serviceProvider);
    let rateByThisCustomer;
    if (!ratings.length) {
      rateByThisCustomer = null;
    } else {
      rateByThisCustomer = providerRate[0].rate;
    }

    const providerName = serviceProvider.fullname;
    const providerPhone = serviceProvider.tel;
    const avatar = await db.GetFileData(user_serviceProvider.avatarFileId, req.username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = Buffer.from(avatar.data).toString("base64");


    let isMyFavotite = false;
    if (providerRate.myFavorite)
      isMyFavotite = true;
    const rate = serviceProvider.rate;
    const contractDetails = contract.description;

    res.send({
      result: {
        providerName,
        providerPhone,
        avatar_base64,
        isMyFavotite,
        rate,
        rateByThisCustomer,
        contractDetails
      },message: "OK"
    });


  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }

});

app.get("/GetServiceProviderByContractId", middleware, async (req, res) => {
  try {

    const contractId = req.body.parameters.contractId;

    const contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const user_serviceProvider = await db.GetUser(serviceProviderUserName, req.username);
    const ServiceProvider = await db.GetServiceProvider(serviceProviderUserName, req.username);

    const serviceProviderAvatarFileId = user_serviceProvider.avatarFileId;
    const serviceProviderFullName = ServiceProvider.fullname;
    const serviceProviderRate = ServiceProvider.rate;

    const avatar = await db.GetFileData(serviceProviderAvatarFileId, req.username);

    let avatar_base64 = null;
    if (avatar)
      avatar_base64 = await Buffer.from(avatar.data).toString("base64");

    res.send({
      result: {

        avatar: avatar_base64,
        fullname: serviceProviderFullName,
        rate: serviceProviderRate

      },
      message: "OK"
    });


  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :{res.status(500).send({
        result: null,
        message: "Internal Server Or Database Error!",
        devMessage: e.message
      });
        console.log(e);}

    }
  }
});

app.post("/AddServiceProviderRateByContractId", middleware, async (req, res) => {
  try {

    const {
      contractId,
      rate,
      description
    } = req.body.parameters;

    if (rate > 5 && rate < 0) {
      throw new Error("400");
    }
    let contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    const data = await db.GetRatingsByCustomerUsername(customerUserName, req.username);

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

    await db.RegisterRate(customerUserName, serviceProviderUserName, newRate, description, req.username);

    res.status(201).send({
      result: {},
      message: "Added!"
    });

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;

      case "405" :
        res.status(400).send({
          result: null,
          message: "Already Rated This Provider!"
        });
        break;

      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }


});

app.patch("/EditMyFavoritesByContractId", middleware, async (req, res) => {
  try {

    const {
      contractId,
      isMyFavorite
    } = req.body.parameters;

    let contract = await db.GetContract(contractId, req.username);

    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    if (!rating.length) {
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, "", req.username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    }
    rating = rating[0];

    await db.UpdateRate(rating.rateid, rating.rate, rating.description, isMyFavorite, req.username);

    res.send({ message: "OK" });

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }


});

app.get("/IsMyFavoriteByContractId", middleware, async (req, res) => {
  try {

    const {
      contractId
    } = req.body.parameters;

    let contract = await db.GetContract(contractId, req.username);
    if (!contract)
      throw new Error("404");

    const serviceProviderUserName = contract.serviceProvider;
    const customerUserName = contract.customer;

    let rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    if (!rating.length) {
      await db.RegisterRate(customerUserName, serviceProviderUserName, 0, "", req.username);
      rating = await db.GetRatingsByCustomerUsername(customerUserName, req.username);
    }
    rating = rating[0];

    let isMyFavorite;
    if (rating.myFavorite) {
      isMyFavorite = true;
    } else {
      isMyFavorite = false;
    }


    res.send({
      result: {

        isMyFavorite

      },
      message: "OK"
    });

  } catch (e) {
    switch (e.message) {
      case "404" :
        res.status(404).send({
          result: null,
          message: "Contract Not Found!"
        });
        break;
      case "400" :
        res.status(400).send({
          result: null,
          message: "Bad Input!"
        });
        break;
      default  :
        res.status(500).send({
          result: null,
          message: "Internal Server Or Database Error!",
          devMessage: e.message
        });
    }
  }


});

//Non-GRPC method
async function calculateAvgRate(serviceProviderUserName, currentRate, currentUsername) {

  const providerRates = await db.GetRatingsByServiceProvider(serviceProviderUserName, currentUsername);
  if (!providerRates.length)
    return null;
  let sum = 0;
  providerRates.forEach((element) => {

    sum += element.rate;

  });

  sum += currentRate;
  return Math.round(sum / (providerRates.length + 1));
}
