const express = require('express');
const user = require('./user');
const blog = require('./blog');
const comment= require('./comment');
const router=express.Router();

router.use('/user',user);
router.use('/blog',blog);
router.use("/comment", comment);
module.exports=router;