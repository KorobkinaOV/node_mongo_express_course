const express = require('express');
const userControllers = require('../controllers/userController');
const authControllers = require('../controllers/authController');

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = userControllers;

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = authControllers;

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword/', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe/', updateMe);
router.delete('/deleteMe/', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
