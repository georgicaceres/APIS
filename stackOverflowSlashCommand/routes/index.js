const express = require('express');
const router = express.Router();
const stackOflowController = require('../controllers/stackOflowController');

/* GET home page. */
router.post('/', stackOflowController.getQuestions);

module.exports = router;
