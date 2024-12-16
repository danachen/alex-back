"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const users_1 = (0, tslib_1.__importDefault)(require("../services/users"));
const middleware_1 = require("../utils/middleware");
const sendmail_1 = (0, tslib_1.__importDefault)(require("../utils/sendmail"));
const verifyRouter = express_1.default.Router();
verifyRouter.get('/resend-email', middleware_1.getUserFromToken, (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const fullUser = yield users_1.default.getById(user.id, false);
    if (!user.verified) {
        yield sendmail_1.default.sendVerificationEmail(fullUser.verificationCode, user.email, user.username);
    }
    res.send('Sent email again.');
}));
verifyRouter.get('/:code/:token', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { code, token } = req.params;
    const verifiedUser = yield users_1.default.verify(code, token);
    if (verifiedUser)
        res.redirect('https://tryalexandria.com/verify');
    res.status(404).send();
}));
exports.default = verifyRouter;
