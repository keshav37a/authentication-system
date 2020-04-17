const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/sign-in', homeController.signIn);
router.get('/sign-up', homeController.signUp);
router.post('/create-user', homeController.createUser);
router.post('/create-session', homeController.createSession);

module.exports = router;