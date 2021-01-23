const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

const {Schema} = mongoose;

const userSchema = new Schema({

    userName:{
        type: 'String',
        required: true,
        unique: true,
        maxlength:25,

    },
    password:{
        type: 'String',
        required: true,
    },
    email:{
        type: 'String',
        required: true,
        minlength:11,
    },
    FirstName:{
        type: 'String',
        minlength:3,
        maxlength:20,
        required: true,
    },
    LastName:{
        type: 'String',
        minlength:3,
        maxlength:20,
        required: true,
    },
    dob:{
        type: Date,
    },
    following:[{
        type:Schema.Types.ObjectId,
        ref:'User',
        optional: true,
    }],
},
{ 
    toJSON: {
        transform: (doc, ret, options) => {
          delete ret.password;
          return ret;
        },
      },
 }

);
  // hash before save
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 8);
    next();
  });


  //_update object contain updates of user   
  userSchema.pre("findOneAndUpdate", function (next) {
      if(!this._update.password){
         next()
      }
      this._update.password=bcrypt.hashSync(this._update.password,8);
      next();
  })
  
  //validate password
  userSchema.methods.validatePassword = function  validatePassword(password){
    return  bcrypt.compareSync(password, this.password);
  }

  



const userModel=mongoose.model('User',userSchema);
module.exports=userModel;