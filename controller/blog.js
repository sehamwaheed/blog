const blog=require('../models/Blog');
const fs=require('fs');

const createBolg=(data)=>blog.create(data);

const getAllBloges=()=>{
    return blog.find({}).populate("author").exec();
}
const searchByTitel=(titel)=>blog.find({titel:titel});

const searchByTages=(tags)=>blog.find({tags:tags});

const searchByAuther=(author)=>blog.find({author:author}).populate("author").exec();

const updateBlog=(id,author, body)=>blog.updateOne({_id:id, author:author},body);

const getBlogById = (id) => blog.findById(id).exec();


const deleteBlog = async(id) =>{
   
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
    getBlogById
    
};