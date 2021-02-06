const express = require("express");
const router = express.Router();
const Comment =require('../controller/comment');
const auth = require('../middelware/auth');
const Blog= require('../controller/blog');
const BlogModule=require('../models/Blog');

router.post("/add/:blog", auth, async (req, res, next) => {
    const blogId = req.params.blog;
    const auther = req.user.id;
    const content = req.body.content;
    try {
      // save Comment In  DataBase
      const commnet = await Comment.createComment({
        content: content,
        author: auther,
      });
  
      // link comment with article
      const article = await Blog.getBlogById(blogId);
      article.comments.push(commnet._id);
  
      // update article
      const update = await Blog.updateBlog(blogId, article).populate('comments').populate('author').exec();
      console.log("After Update", update);
  
      res.json(update);
    } catch (error) {
      next(error);
    }
  });

  // update Comment
router.patch("/update/:commentId", auth, async (req, res, next) => {
    try {
      const update = await Comment.updateComment(req.params.commentId, req.body);
      res.json(update);
    } catch (error) {
      next(error);
    }
  });

  // Delete Comment
router.delete("/delete/:commentId", auth, async (req, res, next) => {
    try {
      // check the access of user if is auther or not
      const comment = await Comment.findCommentByID(req.params.commentId);
  
      if (comment.author == req.user.id) {
        // delete comment
        await Comment.deleteComment(comment._id);
        // remove ref from article
        const blog = await BlogModule.findOne({
          comments: comment._id,
        })
          .populate("Comment")
          .exec();
  
        const index = blog.comments.indexOf(comment._id);
        blog.comments.splice(index, 1);
  
        // update blog
        const update = await Blog.updateBlog(blog._id, blog);
        res.json(update);
        return;
      }
  
      res.send("Invalid Access");
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;