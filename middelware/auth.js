const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/User");

const asyncVerify = promisify(jwt.verify);


const auth = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  if (!authorization) {
    next(new Error("UN_AUTHENTICATED"));
  }
  // console.log(authorization);


  try {
  
    const  {id } = await asyncVerify(authorization.split(" ")[1], "Must_Security");
    // console.log(id);
    const user = await User.findById(id).exec();
    req.user = user;
     
      // console.log(user);
    next();
  } catch (e) {
    next(new Error("UN_AUTHENTICATED2"));
  }
};

module.exports = auth;
