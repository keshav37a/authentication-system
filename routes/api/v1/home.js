const express = require('express');
const router = express.Router();
const homeControllerApi = require('../../../controllers/api/v1/home_api');

router.get('/', homeControllerApi.index);
router.get('/sign-in', homeControllerApi.signIn);

module.exports = router;