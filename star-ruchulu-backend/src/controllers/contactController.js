const contactService = require('../services/contactService');

const registerContact = async (req, res, next) => {
    try {
        const result = await contactService.submitContactMessage(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};
const getContacts = async (req, res, next) => {
    try {
        const messages = await contactService.fetchAllMessages();
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

module.exports = { registerContact, getContacts };
