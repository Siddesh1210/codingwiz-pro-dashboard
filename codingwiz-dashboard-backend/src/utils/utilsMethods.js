import crypto from 'crypto';
import nodemailerTransporter from '../config/nodemailerConfig.js';

export function generateSecureOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

export async function sendEmailToUser(email, otp) {
    try {
        let info = await nodemailerTransporter.sendMail({
            from: 'Siddesh Jaiswal "siddeshjaiswal12@gmail.com"',
            to: email,
            subject: "OTP for Codingwiz Login",
            text: `Your one time otp for login is ${otp}`
        });
        return info;
    } catch (error) {
        throw new Error(error.message)
    }
}

export function generateSecureOrderId() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
}

export function generateSecureSecretKey() {
    return crypto.randomBytes(12).toString('hex').toLowerCase();
}
