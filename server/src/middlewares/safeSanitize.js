import ExpressMongoSanitize from "express-mongo-sanitize";

export const safeSanitize = (req, res, next) => {
    try {
        if (req.query && Object.keys(req.query).length > 0) {
            req.query = sanitize(JSON.parse(JSON.stringify(req.query)));
        }

        if (req.body && Object.keys(req.body).length > 0) {
            req.body = sanitize(JSON.parse(JSON.stringify(req.body)));
        }

        if (req.params && Object.keys(req.params).length > 0) {
            req.params = sanitize(JSON.parse(JSON.stringify(req.params)));
        }

        next();
    } catch (error) {
        console.error('Sanitization error:', error);
        next();
    }
};