const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')



// route
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.post('/forgotPassword',authController.forgotPassword);

router.patch("/resetPassword/:token",authController.resetPassword);
router.patch("/updateMyPassword",authController.protect, authController.updatePassword);
router.get('/me',authController.protect, userController.getMe , userController.getUser)
router.patch("/updateMe", authController.protect , userController.updateMe);
router.delete("/deleteMe", authController.protect , userController.deleteMe) ;

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

    // issue solve in router page on 17 12 2024 

module.exports = router;

