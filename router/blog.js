const express=require('express');
const Blog=require('../controller/blog');
const auth=require('../middelware/auth');
const fileImage= require('../middelware/files');
const user=require('../controller/user');
const router=express.Router();

// creat bloges
router.post('/create',auth,fileImage,async(req, res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const blogs={
        titel: req.body.titel,
        content:req.body.content,
        imagePath:url+'/images/'+req.file.filename,
        author:req.user.id,
        tags:req.body.tags
    }
    try{
        const blog= await Blog.createBolg(blogs);
        res.json(blog);


    }catch(e){
        next(e);
    }

})

// get allBloges
router.get('/',async(req, res,next) =>{
    try{
        const allBloges= await Blog.getAllBloges();
        res.json(allBloges);
    }
    catch(e){
        next(e);
    }
})

// search by titel 
router.get('/:titel',auth,async(req, res,next) =>{
    try{
        const resultSearch= await Blog.searchByTitel(req.params.titel);
        res.json(resultSearch);

    }catch(e){
        next(e);
    }
})


//search by tages
router.get('/tage/:tage',auth,async(req, res, next) =>{
    try{
        const search= await Blog.searchByTages(req.params.tage);
        res.json(search);


    }catch(err){
        next(err);
    }
    
})

//search by author
router.get('/creator/:a',auth,async(req, res, next) =>{
    try{
      
        const author = await user.getName(req.params.a);
     
        if(!author){
            res.send(author);
        }
        const bloges= await Blog.searchByAuther(author.id);
        res.json(bloges);

    }catch(err){
        next(err);
    }
})

// upate 
router.patch('/:id', auth,async (req, res,next)=>{
    const{params: {id} ,body } = req;
    try{
        const blog= await Blog.getBlogById(req.params.id);
        if(blog.author != req.use.id){
            res.send(" access deniad ");
        }
       const editBlog=await Blog.updateBlog(id,req.user.id,body);
       res.json(editBlog);

    }catch(err){next(err);}
})

//delete
router.delete('/:id',async (req, res, next)=>{
    try{
        const blog= await Blog.getBlogById(req.params.id);
        if(blog.author != req.use.id){
            res.send(" access deniad ");
        }
        const deletedBloge= await Blog.deleteBlog(req.params.id);
          res.json(deletedBloge);
    }
    catch(err){next(err);}
})


module.exports=router;