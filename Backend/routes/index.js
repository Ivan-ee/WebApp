const express = require('express');
const multer = require('multer');
const {UserController} = require("../controllers");
const authToken = require("../middleware/auth");
require('dotenv').config();

const router = express.Router();
const uploadDestination = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}.${file.originalname}`);
    }
})


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authToken, UserController.current);
router.get('/users/:id', authToken, UserController.getUserById);
router.put('/users/:id', authToken ,UserController.update);

module.exports = router;