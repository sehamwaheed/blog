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
    console.log(`asdasd`);
    try{
      
        const author = await user.getName(req.params.a);
        console.log(author)
     
        if(!author){
            res.send(author);
        }

        const bloges= await Blog.searchByAuther(author._id);
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
      
        if(blog.author != req.user.id){
            res.send(" access deniad ");
            return;
        }
        const editBlog=await Blog.updateBlog(id, body);
    
       res.json(editBlog);

    }catch(err){next(err);}
})

//delete
router.delete('/:id',auth,async (req, res, next)=>{
    try{
        const blog= await Blog.getBlogById(req.params.id);
      
        if(blog.author != req.user.id){
            res.send(" access deniad ");
            return;
        }
        const deletedBloge= await Blog.deleteBlog(req.params.id);
          res.json(deletedBloge);
    }
    catch(err){next(err);}
})

router.patch('/img/:id',auth,fileImage,async(req, res, next)=>
{
    const url = req.protocol + '://' + req.get('host');
    try{
        const blog= await Blog.getBlogById(req.params.id);
      
        if(blog.author != req.user.id){
            res.send(" access deniad ");
            return;
        }
         const  imgUpdated= await  Blog.updateImage(req.params.id,{ imagePath : url +"/images" + req.file.filename });
         res.json(imgUpdated);


    }
    catch(err){next(err);}
})

module.exports=router;