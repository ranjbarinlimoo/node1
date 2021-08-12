const grpc = require('@grpc/grpc-js')
const loader = require('@grpc/proto-loader')


const pkgDef = loader.loadSync('C:\\Users\\Mamali\\Desktop\\JS\\Limoo\\second_project\\prototypes\\ranjbar.proto',
    {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const pkg = grpc.loadPackageDefinition(pkgDef).AuthPkg

const client = new pkg.TestService('127.0.0.1:50052', grpc.credentials.createInsecure())

client.RegisterSession({UserName:'SSSS',Ip:'192.xx.xx.xx'},function(err,res) {
    console.log(err)
    console.log(JSON.parse(res.Data))
})