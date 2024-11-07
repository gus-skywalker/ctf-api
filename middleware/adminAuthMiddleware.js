// adminAuthMiddleware.js
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
};

module.exports = adminAuth;
