import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({
            success: false,
            message: 'Unauthorized, Please Login First'
        });

        const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        if (!accessSecret) {
            return res.status(500).json({
                success: false,
                message: 'Missing JWT access secret'
            });
        }
        const payload = jwt.verify(token, accessSecret);
        req.user = payload;
        return next();
    } catch (error) {
        console.log(error);
        const isExpired = error && error.name === 'TokenExpiredError';
        const refreshToken = req.cookies.refreshToken
        return res.status(401).json({
            success: false,
            message: isExpired ? 'Access token expired' : 'Invalid token',
            refreshToken
        });
    }
}

export function isAuthenticated(req, res, next) {
    if (req?.user) return next();
    console.log("req.user".req?.user);
    return res.status(401).json({
        success: false,
        message: 'Unauthorized, Please Login First'
    });
}