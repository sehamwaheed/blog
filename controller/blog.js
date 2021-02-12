const blog=require('../models/Blog');
const fs=require('fs');

const createBolg=(data)=>blog.create(data);

const getAllBloges=()=>{
    return blog.find({}).populate("author").populate("comments")
    .populate({
        path:"comments",
        populate:{
            path:"author",
            model: "User"
        }
    }).exec();
}
const searchByTitel=(titel)=>blog.find({titel:titel});

const searchByTages=(tags)=>blog.find({tags:tags});

const searchByAuther=(author)=>{
    
    return blog.find({author:author}).populate("author").exec();
}

const updateBlog=(id, body)=>{
   return blog.findByIdAndUpdate(id,body,{new:true})
};

const getBlogById = (id) => blog.findById(id).populate("author").populate("comments") .populate({
        path:"comments",
        populate:{
            path:"author",
            model: "User"
        }
    }).exec();




const deleteBlog = (id) =>{
    deletimag(id);
     return  blog.findByIdAndDelete(id).exec();
       
}

async function deletimag(id){
    const {imagePath}= await  blog.findByIdAndDelete(id).exec();
     
    const img= imagePath.split('/');
    const [ , , ,file,imgName]=img;
    const path= file +'/' + imgName;
    try{
       
        fs.unlinkSync(path);
    }
    catch(e){
        console.log(e);
    }


}

module.exports={
    createBolg,
    getAllBloges,
    searchByTitel,
    searchByTages,
    searchByAuther,
    updateBlog,
    deleteBlog,
    getBlogById,

    
};