const mongoose=require('mongoose');
const {Schema} = mongoose;

const blogSchema = new Schema({
    titel:{
        type: 'String',
        required: true,
        maxlength:60,
    },
    content:{
        type: 'String',
        required: true,
    },
    imagePath:{
        type:String,
        required: true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
     tags:[String],
     creatAt:{
         type: 'Date',
         default: new Date,
     },
     likes: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      comments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    });
    

const blogModel=mongoose.model('Blog',blogSchema);
module.exports=blogModel;