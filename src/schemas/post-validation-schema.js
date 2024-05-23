const { body, query } = require('express-validator');

const validatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('text').notEmpty().withMessage('Text is required'),
  body('foreignKey').notEmpty().withMessage('Foreign key is required').isString().withMessage('Foreign key must be a string')
];

validateGetUserPost = [
  body('userId').notEmpty().withMessage('userId is required').isString(),
]

const validateDeletePost = [
  body('postId').notEmpty().withMessage('Post ID is required').isString().withMessage('Post ID must be a string'),
  body('foreignKey').notEmpty().withMessage('Foreign key is required').isString().withMessage('Foreign key must be a string')
];

module.exports = {
  validatePost,
  validateDeletePost,
  validateGetUserPost
};
