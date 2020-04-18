const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

//home-page
router.get('/', homeController.home);

//sign-in-page
router.get('/sign-in', homeController.signIn);

//sign-up-page
router.get('/sign-up', homeController.signUp);

//submission of create-user form in sign-up page
router.post('/create-user', homeController.createUser);

//submission of login form in sign-up page
router.post('/create-session', passport.authenticate('local', {failureRedirect: '/sign-in'},) ,homeController.createSession);

router.get('/sign-out', homeController.destroySession);

router.use('/api', require('./api'));

//To render the forgot password page
router.get('/forgot-password', homeController.forgotPassword);

//To make the forgot password request by posting the email address
router.post('/forgot-password-request', homeController.forgotPasswordRequest);

//Render the reset-password page
router.get('/reset-password', homeController.resetPassword);

//Submitting the reset password form
router.post('/reset-password-request', homeController.resetPasswordRequest);

//Click on the link sent to new user
router.get('/verify', homeController.verifyEmail);

module.exports = router;