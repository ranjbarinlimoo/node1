const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const env = require("dotenv").config();
const chalk = require("chalk");

const Services = require('./API/index')

const packageDefinition = protoLoader.loadSync("./prototypes/ranjbar.proto", {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const pkg = grpc.loadPackageDefinition(packageDefinition).Frontend;


async function startGrpcServer() {
  let server = new grpc.Server();
  server.addService(pkg.CustomerPanel.service, Services );
  server.bindAsync(`${process.env.GRPS_SERVER_HOST}:${process.env.GRPS_SERVER_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(chalk.blue.bold(`GRPC Server Is Running On Port: ${process.env.GRPS_SERVER_PORT}`));
  });
}

startGrpcServer().then(r => r ? console.log(r) : console.log()).then((e) => e ? console.log(e) : console.log());

