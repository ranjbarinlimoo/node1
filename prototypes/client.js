const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");
const chalk = require("chalk");
const env = require("dotenv").config();
const path = require('path')

module.exports = new (class Client {

  constructor() {

    const pkgDef = loader.loadSync(path.join(__dirname,'./ranjbar.proto'),
      {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    );

    const pkg = grpc.loadPackageDefinition(pkgDef).Frontend;
    this.client = new pkg.CustomerPanel(`${process.env.GRPC_SERVER_HOST}:${process.env.GRPC_SERVER_PORT}`, grpc.credentials.createInsecure());

    console.log(chalk.yellow.bold('GRPC Client Is Running!!'));
  }



  async getToken() {
    await this.client.GetUserContractsList({
      JSON: JSON.stringify({ UserName: "moharrami" })
    }, (err, res) => {

      return JSON.parse(res);
    });
  }
});

