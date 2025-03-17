var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
const { check_authentication } = require('../Utils/check_auth');

router.post('/signup', async function(req, res, next) {
    try {
        let body = req.body;
        let result = await userController.createUser(
          body.username,
          body.password,
          body.email,
         'user'
        )
        res.status(200).send({
          success:true,
          data:result
        })
      } catch (error) {
        next(error);
      }

})
router.post('/login', async function(req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let result = await userController.checkLogin(username,password);
        res.status(200).send({
            success:true,
            data:result
        })
      } catch (error) {
        next(error);
      }

})
router.get('/me',check_authentication, async function(req, res, next){
    try {
      res.status(200).send({
        success:true,
        data:req.user
    })
    } catch (error) {
        next();
    }
})
router.get('/resetPassword/:id', check_authentication, async function(req, res, next) {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).send({
              success: false,
              message: 'Only admins can reset passwords.'
          });
      }
      let userId = req.params.id;
      let result = await userController.resetPassword(userId, '123456');
      res.status(200).send({
          success: true,
          data: result
      });
  } catch (error) {
      next(error);
  }
});

router.post('/changePassword', check_authentication, async function(req, res, next) {
  try {
      let currentPassword = req.body.password;
      let newPassword = req.body.newpassword;
      let userId = req.user._id;

      let isPasswordCorrect = await userController.verifyPassword(userId, currentPassword);
      if (!isPasswordCorrect) {
          return res.status(400).send({
              success: false,
              message: 'Current password is incorrect.'
          });
      }

      let result = await userController.changePassword(userId, newPassword);
      res.status(200).send({
          success: true,
          data: result
      });
  } catch (error) {
      next(error);
  }
});

module.exports = router