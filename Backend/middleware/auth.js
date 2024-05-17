const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Отсутвует токен'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({error: 'Invalid token'});

        req.user = decoded;

        next();
    });
};

module.exports = authToken;