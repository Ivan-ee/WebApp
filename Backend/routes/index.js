const express = require('express');
const multer = require('multer');
const {UserController, PostController, CommentController, LikeController, FollowController, MessageController} = require("../controllers");
const {authToken} = require("../middleware/auth");
require('dotenv').config();

const router = express.Router();
const uploadDestination = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}.${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authToken, UserController.current);
router.get('/users/:id', authToken, UserController.getUserById);
router.put('/users/:id', authToken, upload.single('avatar'), UserController.update);

router.post('/posts', authToken, PostController.create);
router.get('/posts', authToken, PostController.getAll);
router.get('/posts/:id', authToken, PostController.getById);
router.delete('/posts/:id', authToken, PostController.delete);

router.post('/comments', authToken, CommentController.create);
router.delete('/comments/:id', authToken, CommentController.delete);

router.post('/likes', authToken, LikeController.like);
router.delete('/likes/:id', authToken, LikeController.unlike);

router.post('/follow', authToken, FollowController.follow);
router.delete('/unfollow/:id', authToken, FollowController.unfollow);

router.post('/send/:id', authToken, MessageController.send);

module.exports = router;