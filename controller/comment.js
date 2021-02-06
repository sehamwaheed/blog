const Comment = require("../models/Comment");

// create new Comment
const createComment = (comment) => Comment.create(comment);

// update Comment
const updateComment = (id, comment) =>
  Comment.findByIdAndUpdate(id, comment, { new: true }).populate('author');

// delete Comment
const deleteComment = (id) => Comment.findByIdAndDelete(id);

// find Commnet By Id
const findCommentByID = (id) => Comment.findById(id).populate('author');

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  findCommentByID,
};