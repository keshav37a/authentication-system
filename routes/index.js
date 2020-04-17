const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

router.get('/', homeController.home);
router.get('/sign-in', homeController.signIn);
router.get('/sign-up', homeController.signUp);
router.post('/create-user', homeController.createUser);
router.post('/create-session', passport.authenticate('local', {failureRedirect: '/sign-in'},) ,homeController.createSession);
router.get('/sign-out', homeController.destroySession);

//To render the forgot password page
router.get('/forgot-password', homeController.forgotPassword);

//To make the forgot password request by posting the email address
router.post('/forgot-password-request', homeController.forgotPasswordRequest);

router.get('/reset-password', homeController.resetPassword);

router.post('/reset-password-request', homeController.resetPasswordRequest);

router.get('/verify', homeController.verifyEmail);

module.exports = router;