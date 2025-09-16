import User from "../models/User.js";
import { generateOtp, saveOtp } from "../utils/auth.js";
import { sendMessageToEmail } from "../utils/email.js";
import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import 'dotenv/config';
import crypto from 'crypto';
import Otp from "../models/Otp.js";

const MAX_WRONG_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 45;

export async function requestOtp(req, res) {
    try {
        const { email, purpose = "email-verify", meta = {} } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        });

        const user = await User.findOne({ email });

        // Purpose-specific prechecks:
        if (purpose === "email-verify") {
            if (user?.isEmailVerified) {
                return res.status(400).json({ success: false, message: "Email is already verified" });
            }
        } else if (purpose === "password-reset" || purpose === "2fa" || purpose === "login" || purpose === "password-change") {

            if (!user) return res.status(404).json({
                success: false,
                message: "No account found for this email"
            });
        }

        const { code, codeHash, expiresAt } = generateOtp({ length: 6, ttlMinutes: 10 });
        const ip = req.ip;

        console.log(code);
        await saveOtp(email, codeHash, expiresAt, purpose, { ip, ...meta });

        const templatePath = path.resolve(process.cwd(), 'src', 'templates', 'otp.mjml');
        const mjml = fs.readFileSync(templatePath, 'utf8')
            .replaceAll('{{CODE}}', String(code))
            .replaceAll('{{APP_NAME}}', process.env.APP_NAME)
            .replaceAll('{{CURRENT_DATE}}', String(new Date().getFullYear().toString()));

        const { html, errors } = mjml2html(mjml, { validationLevel: 'soft' });
        if (!html) {
            throw new Error('Failed to render OTP email');
        }

        const subject = 'Your One Time Password (OTP)';
        await sendMessageToEmail({ to: email, from: process.env.EMAIL_FROM, html, subject });

        return res.json({
            success: true,
            message: `OTP sent to <${email}>`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
}

export async function resendOtp(req, res) {
    try {
        const { email, purpose = "email-verify" } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const last = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
        if (last) {
            const diff = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
            if (diff < RESEND_COOLDOWN_SECONDS) {
                return res.status(429).json({ success: false, message: `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - diff)}s before resending.` });
            }
        }
        return await requestOtp(req, res);
    } catch (err) {
        console.error("resendOtp error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP"
        });
    }
}

export async function verifyOtp(req, res) {
    try {
        const { email, code, purpose = "email-verify" } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        });

        if (!code) return res.status(400).json({
            success: false,
            message: "OTP code is required"
        });

        if (!/^[0-9]{6}$/.test(String(code))) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP code format"
            });
        }
        console.log(email, purpose);

        const record = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
        if (!record) return res.status(404).json({
            success: false,
            message: "No OTP record found"
        });

        if (record.consumed || record.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or already used"
            });
        }

        const codeHash = crypto.createHash("sha256").update(String(code)).digest("hex");
        if (record.codeHash !== codeHash) {
            record.attempts += 1;
            if (record.attempts >= MAX_WRONG_ATTEMPTS) {
                record.consumed = true;
            }
            await record.save();
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP"
            });
        }

        record.consumed = true;
        await record.save();

        // Purpose-specific actions
        if (purpose === "email-verify") {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({
                success: false,
                message: "User not found"
            });
            if (!user.isEmailVerified) {
                user.isEmailVerified = true;
                await user.save();
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Email already verified"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Email verified successfully"
            });
        }

        if (purpose === "password-reset") {
            const token = jwt.sign({ email },
                process.env.JWT_SECRET, { expiresIn: "5m" });
            return res.status(200).json({
                success: true,
                message: "OTP verified successfully", token
            });
        }

        if (purpose === "2fa" || purpose === "login" || purpose === "password-change") {
            return res.status(200).json({
                success: true,
                message: "OTP verified successfully",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (err) {
        console.error("verifyOtp error:", err);
        return res.status(500).json({ success: false, message: "Failed to verify OTP" });
    }
}