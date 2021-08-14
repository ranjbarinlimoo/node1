const express = require('express')
const jwt = require('jsonwebtoken')
const client = require('../../prototypes/client')
const env = require("dotenv").config();
const secret = process.env.SECRET


module.exports = async (req, res, next) => {

  // const token = await client.getToken()
  // req.username = await jwt.verify(token,secret);
  req.username = 'test user'

  next();

};