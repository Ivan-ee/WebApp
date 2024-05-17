const express = require('express');
const multer = require('multer');

const router = express.Router();
const uploadDestination = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}.${file.originalname}`);
    }
})

router.get('/register', (req, res) => {
    res.send('register')
});

module.exports = router;