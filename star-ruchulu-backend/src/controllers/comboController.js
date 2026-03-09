const comboModel = require('../models/comboModel');

const getCombos = async (req, res, next) => {
    try {
        const combos = await comboModel.fetchAllCombos();
        res.json(combos);
    } catch (error) {
        next(error);
    }
};

const getComboById = async (req, res, next) => {
    try {
        const combo = await comboModel.fetchComboById(req.params.id);
        res.json(combo);
    } catch (error) {
        res.status(404);
        next(error);
    }
};

module.exports = {
    getCombos,
    getComboById
};
