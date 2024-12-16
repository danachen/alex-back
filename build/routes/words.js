"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const words_1 = (0, tslib_1.__importDefault)(require("../services/words"));
const router = express_1.default.Router();
router.get('/text/:textId/language/:languageId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { textId, languageId } = req.params;
    const userwordsInText = yield words_1.default.getUserwordsInText(Number(user.id), Number(textId), languageId, true);
    res.json(userwordsInText);
}));
router.get('/language/:languageId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { languageId } = req.params;
    const userwordsInLanguage = yield words_1.default.getUserwordsByLanguage(languageId, Number(user.id));
    res.json(userwordsInLanguage);
}));
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const userWordData = req.body;
    const newUserWord = yield words_1.default.addNewUserWord(user, userWordData);
    res.status(201).json(newUserWord);
}));
router.put('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { id } = req.params;
    const { status } = req.body;
    if (status) {
        const updatedStatus = yield words_1.default.updateStatus(Number(id), Number(user.id), status);
        res.send(updatedStatus);
    }
    else {
        yield words_1.default.removeUserWord(Number(id), Number(user.id));
        res.status(204).send();
    }
}));
exports.default = router;
