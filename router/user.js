const express = require("express");
const router = express.Router();
const auth = require("../middelware/auth");
const {createUser,getAllUsers,updateUser,deleteUser,loginUser,getName,userId,getFollowers}=require("../controller/user");



// get my followers 
router.get('/follower',auth,async(req, res, next)=>{
    try{
          
        const myfollowers = await getFollowers(req.user.id);
        res.json(myfollowers);
    

    }
    catch(error){
        next(error);}
});


//register
router.post("/",async(req, res,next) => {
  
   const {body} = req;
   try {
  

        const user= await createUser(body);
        res.json(user);
         
   }catch(e) {
       next(e);
   }

})

//login
router.post("/login",async(req, res, next) => {

    const body = req.body;
    try {
        console.log(`body`, body);
      const user = await loginUser(body);
      if (!user){
        res.status(500).json({error:"error happened"})
      }
   
      res.json(user);
    } catch (e) {
        console.log("from catch");
        console.log(e);
      next(e);
    }
})

//update
router.patch("/:id",auth ,async(req, res, next) => {
    const id=req.params.id;
    const data=req.body;
    console.log(id,data)
    try{
        const user=await updateUser(id,data);
        res.json(user);
    }catch(e){

        next(e);
    }


})

//delel
router.delete("/:id",async(req, res, next) =>{
    try{
        const user =await deleteUser(req.params.id);
        res.json(user);
    }
    catch(e){
        next(e);
    }
})

//get all users
router.get("/",auth,async(req, res, next) =>{

   try{
    const user =await getAllUsers();
    res.json(user);

   }catch(e){
     next(e);
   }
})

// search by name 
router.get('/userName/:userName',auth,async(req, res, next)=>{
    try {
        
        console.log(req.params);
        const userN= await getName(req.params.userName);
        console.log(`userN`, userN);
        res.json(userN);
    } catch (error) {

        next(error);
    }
})

// get your profile
router.get('/profile',auth,async(req, res, next)=>{
    try {
        
  
        const userN= await userId(req.user.id);

        res.json(userN);
    } catch (error) {

        next(error);
    }
})

// following
router.get('/followe/:id',auth, async(req, res, next) => {
    try {
        const Id= req.params.id;
        if(Id ==req.user.id){
            res.send("can not follow your self");
            return;
        }
        let user=await userId(Id);
        const index= user.following.findIndex((e) => {
           
            return  req.user.id==e;
        })

        if(index == -1)
        {
            user=user.toJSON();
            user.following.push(req.user.id);
            let userUpdated= await updateUser(Id,user);
            res.json(userUpdated);
        }
    }catch(error) {next(error);}
});

//unfollow

router.patch('/unfollow/:id',auth,async(req, res, next)=>{
      
    try{
            
        const Id= req.params.id;
        if(Id ==req.user.id){
            res.send("can not unfollow your self");
            return;
        }
        let user=await userId(Id);
        const index= user.following.findIndex((e) => {
           
            return  req.user.id==e;
        })
        
        if(index != -1){
            user=user.toJSON();
            user.following.splice(index,1);
           let userUpdated= await updateUser(Id,user);
            res.json(userUpdated);
        }
        
        res.send("you are unfollow ");
    }
    catch(error) {next(error);}
});





module.exports =router;