const express = require('express');
const router = express.Router();
const homeControllerApi = require('../../../controllers/api/v1/home_api');

router.get('/', homeControllerApi.index);

module.exports = router;