"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    transporter;
    constructor() {
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        if (smtpHost && smtpUser && smtpPass) {
            this.transporter = nodemailer_1.default.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
        }
        else {
            // Fallback test / mock transporter (e.g. for development / testing)
            this.transporter = nodemailer_1.default.createTransport({
                jsonTransport: true,
            });
        }
    }
    async sendOrderConfirmationEmail(payload) {
        const { orderId, userEmail, userName, productName, quantity, totalAmount } = payload;
        console.log(`[Notification Service] 📧 Processing notification for Order #${orderId}...`);
        console.log(`[Notification Service] Recipient: ${userName || "Customer"} <${userEmail}>`);
        console.log(`[Notification Service] Order Details: ${quantity}x ${productName} - Total: $${totalAmount}`);
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"StockFlow Orders" <no-reply@stockflow.com>',
            to: userEmail,
            subject: `Order Confirmation - Order #${orderId}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Thank you for your order, ${userName || "Valued Customer"}!</h2>
          <p>Your order has been placed successfully.</p>
          <hr />
          <h3>Order Details:</h3>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Product:</strong> ${productName}</li>
            <li><strong>Quantity:</strong> ${quantity}</li>
            <li><strong>Total Amount:</strong> $${totalAmount}</li>
          </ul>
          <p>We will notify you once your order is processed for shipping.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">StockFlow E-Commerce Platform</p>
        </div>
      `,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Notification Service] ✅ Confirmation email sent successfully to ${userEmail}! MessageId: ${info.messageId || "mock-id"}`);
        }
        catch (error) {
            console.error(`[Notification Service] ❌ Failed to send email to ${userEmail}:`, error);
        }
    }
}
exports.EmailService = EmailService;
