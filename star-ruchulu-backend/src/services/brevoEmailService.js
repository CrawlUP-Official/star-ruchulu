require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, htmlContent) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY.trim();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
        name: process.env.EMAIL_FROM_NAME || 'Star Ruchulu',
        email: process.env.EMAIL_FROM || 'starruchulu@gmail.com'
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Brevo email sent to ${to}. MessageId: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error('Brevo email failed:', error.response?.text || error.message);
        throw error;
    }
};

module.exports = {
    sendEmail
};
