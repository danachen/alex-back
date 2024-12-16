"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const users_1 = (0, tslib_1.__importDefault)(require("../services/users"));
const middleware_1 = require("../utils/middleware");
const userRouter = express_1.default.Router();
userRouter.get('/from-token', middleware_1.getUserFromToken, (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const response = yield users_1.default.getById(user.id);
    res.json(response);
}));
userRouter.get('/', middleware_1.getUserFromToken, (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const isAdmin = yield users_1.default.isAdmin(Number(user.id));
    if (isAdmin) {
        const response = yield users_1.default.getAll();
        res.json(response);
    }
    res.status(404).send();
}));
userRouter.post('/confirm', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { password } = req.body;
    const response = yield users_1.default.verifyPassword(user.id, password);
    if (response) {
        res.json({ match: 'true' });
    }
    else {
        res.json({ match: 'false' });
    }
}));
userRouter.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { username, password, email, knownLanguageId, learnLanguageId, } = req.body;
    const newUser = yield users_1.default.addNew(username, password, email, knownLanguageId, learnLanguageId);
    res.status(201).json(newUser);
}));
userRouter.put('/update-info', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { userName, email } = req.body;
    const updatedUser = yield users_1.default.updateUserInfo(user.id, userName, email);
    return res.json(updatedUser);
}));
userRouter.put('/change-password', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { currentPassword, newPassword } = req.body;
    const response = yield users_1.default.updatePassword(user.id, currentPassword, newPassword);
    res.json(response);
}));
userRouter.put('/set-languages', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { knownLanguageId, learnLanguageId } = req.body;
    const updatedUser = yield users_1.default.setUserLanguages(knownLanguageId, learnLanguageId, user.id);
    return res.json(updatedUser);
}));
userRouter.delete('/', middleware_1.getUserFromToken, (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    yield users_1.default.remove(user.id);
    res.status(204).send();
}));
exports.default = userRouter;
