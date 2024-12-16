"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const translations_1 = (0, tslib_1.__importDefault)(require("../services/translations"));
const router = express_1.default.Router();
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { wordId, translation, targetLanguageId, context, } = req.body;
    const newTranslation = yield translations_1.default
        .add(Number(wordId), translation, targetLanguageId);
    if (newTranslation.id) {
        yield translations_1.default.addToUsersTranslations(Number(user.id), newTranslation.id, context);
    }
    res.send(newTranslation);
}));
router.put('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { translation } = req.body;
    const { id } = req.params;
    const updatedTranslation = yield translations_1.default.update(Number(id), translation);
    const { user } = res.locals;
    const context = yield translations_1.default.getUserTranslationContext(Number(user.id), Number(id));
    res.json(Object.assign(Object.assign({}, updatedTranslation), { context }));
}));
router.delete('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield translations_1.default.remove(Number(id));
    res.status(204).send();
}));
exports.default = router;
