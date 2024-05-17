const express = require('express');
const multer = require('multer');
const {UserController} = require("../controllers");
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
router.get('/current', UserController.current);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.update);

module.exports = router;