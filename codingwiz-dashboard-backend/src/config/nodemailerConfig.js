import nodemailer from 'nodemailer'
import { email, emailPassKey } from './envConfig.js';
const nodemailerTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: emailPassKey
    }
});

export default nodemailerTransporter;