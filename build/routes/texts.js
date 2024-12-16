"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const texts_1 = (0, tslib_1.__importDefault)(require("../services/texts"));
const users_1 = (0, tslib_1.__importDefault)(require("../services/users"));
const router = express_1.default.Router();
router.get('/language/:languageId/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { languageId } = req.params;
    const allTexts = yield texts_1.default.getByUserAndLanguage(Number(user.id), languageId);
    res.json(allTexts);
}));
router.get('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { id } = req.params;
    const textById = yield texts_1.default.getById(Number(id));
    if (textById.userId === user.id) {
        res.json(textById);
    }
    res.status(404).send();
}));
router.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const isAdmin = yield users_1.default.isAdmin(Number(user.id));
    if (isAdmin) {
        const allTexts = yield texts_1.default.getAll();
        res.json(allTexts);
    }
    res.status(404).send();
}));
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    if (user.verified === true) {
        const textData = req.body;
        textData.userId = user.id;
        const text = yield texts_1.default.addNew(textData);
        res.json(text);
    }
    res.status(406).send();
}));
router.put('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const id = Number(req.params.id);
    const textData = req.body;
    if (textData.userId === user.id) {
        const updatedText = yield texts_1.default.update(Object.assign({ id }, textData));
        res.json(updatedText);
    }
    res.status(406).send();
}));
router.delete('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const id = Number(req.params.id);
    const toBeDeleted = yield texts_1.default.getById(id);
    if (toBeDeleted.userId === user.id) {
        yield texts_1.default.remove(id);
        res.status(204).send();
    }
    res.status(406).send();
}));
exports.default = router;
