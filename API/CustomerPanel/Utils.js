const db = require('../../modules/stored_procedures')


async function calculateAvgRate(serviceProviderUserName, currentRate, username) {

  const providerRates = await db.GetRatingsByServiceProvider(serviceProviderUserName, username);
  if (!providerRates.length)
    return null;
  let sum = 0;
  providerRates.forEach((element) => {

    sum += element.rate;

  });

  sum += currentRate;
  return Math.round(sum / (providerRates.length + 1));
}


module.exports = {calculateAvgRate}