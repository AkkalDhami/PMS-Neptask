const memoryStore = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function otpRequestRateLimit({ keyPrefix = "otp", max = MAX_PER_WINDOW, windowMs = WINDOW_MS } = {}) {
    return (req, res, next) => {
        try {
            const email = (req.body && req.body.email) || req.user?.email || req.ip;
            const key = `${keyPrefix}:${email}`;
            const now = Date.now();
            const entry = memoryStore.get(key) || { count: 0, firstAt: now };
            if (now - entry.firstAt > windowMs) {
                entry.count = 0;
                entry.firstAt = now;
            }
            entry.count += 1;
            memoryStore.set(key, entry);
            if (entry.count > max) {
                return res.status(429).json({
                    success: false,
                    message: `Too many OTP requests for this resource. Try again later.`
                });
            }
            next();
        } catch (err) {
            next();
        }
    };
}
