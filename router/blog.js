const express=require('express');
const Blog=require('../controller/blog');
const auth=require('../middelware/auth');
const fileImage= require('../middelware/files');
const user=require('../controller/user');
const router=express.Router();


//get blog by id
router.get('/:id',auth,async(req, res, next)=>{
    try{
        console.log('in get id');
     const blog = await Blog.getBlogById(req.params.id);
     console.log(blog);
     res.json(blog);
    }catch(err){next(err);}
 })

 
// search by titel 
router.get('/title/:titel',auth,async(req, res,next) =>{
    try{
        const resultSearch= await Blog.searchByTitel(req.params.titel);
        console.log(resultSearch);
        res.json(resultSearch);

    }catch(e){
        next(e);
    }
})

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
router.patch('/:id', auth,fileImage,async (req, res,next)=>{
    const{params: {id} ,body } = req;
    let imagePath = req.body.imagePath;
// console.log(imagePath);

try{
    
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
        // console.log(imagePath);
        }
        
        const blog= await Blog.getBlogById(req.params.id);
      
        if(blog.author._id != req.user.id){
            res.send(" access deniad ");
            return;
        }
        body.imagePath = imagePath;
        const editBlog=await Blog.updateBlog(id, body);
    
       res.json(editBlog);

    }catch(err){next(err);}
})

//delete
router.delete('/:id',auth,async (req, res, next)=>{
    try{
        const blog= await Blog.getBlogById(req.params.id);
      
        if(blog.author._id != req.user.id){
            res.send(" access deniad ");
            return;
        }
        const deletedBloge= await Blog.deleteBlog(req.params.id);
          res.json(deletedBloge);
    }
    catch(err){next(err);}
})


// like The Article
router.post("/like/:id", auth, async (req, res, next) => {
    try {
      const blog = await Blog.getBlogById(req.params.id);
  
      const index = blog.likes.findIndex((c) => {
        return (req.user.id = c);
      });
  
      if (index == -1) {
        blog.likes.push(req.user.id);
        console.log(blog);
        const update = await Blog.updateBlog(req.params.id, blog);
        res.json(update);
        return;
      }
      else{
        blog.likes.splice(index, 1);
        const update = await Blog.updateBlog(req.params.id, blog);
        res.json(update);
        return;
      }
  
      
    } catch (error) {
      next(error);
    }
  });

  // un Like
  router.post('/unlike/:id',auth, async(req, res, next)=>{
    try {
        const blog = await Blog.getBlogById(req.params.id);
    
        const index = blog.likes.findIndex((c) => {
          return (req.user.id = c);
        });
    
        if (index != -1) {

        blog.likes.splice(index, 1);
          console.log(blog);
          const update = await Blog.updateBlog(req.params.id, blog);
          res.json(update);
          return;
        }
    
        res.send("Already UnLiked");
      } catch (error) {
        next(error);
      }
  })

module.exports=router;