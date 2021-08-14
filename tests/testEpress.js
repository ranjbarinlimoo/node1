
const express = require('express')
const app = express()
app.use(express.json())

app.listen(8081)

app.get('/test',async(req,res)=>{

  res.send({result:{name:'hi'}})

})