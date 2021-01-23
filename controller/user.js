const User=require("../models/User");
const jwt=require("jsonwebtoken");
const { promisify } = require("util");

const asyncSign = promisify(jwt.sign);

//to create a new User
const createUser =(user)=>{
   return  User.create(user);

}

//get all users  
const getAllUsers =()=>{
  return  User.find({}).populate("following").exec();
}

// update
const updateUser= (id,data)=>{

  return User.findByIdAndUpdate(id,data,{new:true}).populate("following").exec();
 
}

//login user
const loginUser = async ({ email, password }) => {
   // search for user by username
   const user = await User.findOne({ email }).exec();
 
   // check if user is Authenticated
   if (!user) {
     throw Error("UN_AUTHENTICATED");
   }
 
   // check if password is correct or not
   const validPassword = await user.validatePassword(password);
   if (!validPassword) {
     throw Error("UN_AUTHENTICATED");
   }
 
   const token = await asyncSign(
     {
       username: user.username,
       email: user.email,
       id: user.id,
     },
     "Must_Security",
     { expiresIn: "1d" }
   );
 
   console.log(token);
 
   return { ...user.toJSON, token };
 };

// find followers
const getFollowers= (followers)=>User.find( { following : followers } ).populate('User').exec();



//delete user
const deleteUser=(id)=>{
     User.findByIdAndDelete(id).exec();
}

// get user name
const getName =(name)=>User.find({userName:name})
// get user identity
const userId= (id)=>User.findById(id).exec();


module.exports={
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    loginUser,
    getName,
    userId,
    getFollowers,

};

