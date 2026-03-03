const Contact = require('../models/contactModel');

const submitContactMessage = async (data) => {
    if (!data.name || !data.email || !data.message) {
        throw new Error('Name, Email and Message are explicitly required');
    }

    const insertId = await Contact.create(data);
    return { success: true, insertId, message: "Will receive email shortly" };
};

const fetchAllMessages = async () => {
    return await Contact.findAll();
};

module.exports = { submitContactMessage, fetchAllMessages };
