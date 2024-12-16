"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const sendmail_1 = (0, tslib_1.__importDefault)(require("../utils/sendmail"));
const users_1 = (0, tslib_1.__importDefault)(require("../data-access/users"));
const texts_1 = (0, tslib_1.__importDefault)(require("../data-access/texts"));
const types_1 = require("../types");
const sanitizeUser = function (user) {
    const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        knownLanguageId: user.knownLanguageId,
        learnLanguageId: user.learnLanguageId,
        verified: user.verified,
    };
    return sanitizedUser;
};
const isAdmin = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.isAdmin(userId);
        if (result.rowCount === 0)
            return false;
        return true;
    });
};
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getAll();
        const allUsers = result.rows.map((dbItem) => (0, types_1.convertUserTypes)(dbItem));
        return allUsers;
    });
};
const getById = function (userId, sanitize = true) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getById(userId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('cannot find user with this id');
        const foundUser = (0, types_1.convertUserTypes)(result.rows[0]);
        if (sanitize)
            return sanitizeUser(foundUser);
        return foundUser;
    });
};
const verifyPassword = function (userId, password) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getById(userId);
        const user = result.rows[0];
        const passwordsMatch = yield bcrypt_1.default.compare(password, user.password_hash);
        return passwordsMatch;
    });
};
const addNew = function (username, password, email, knownLanguageId, learnLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const emailExists = yield users_1.default.getByEmail(email);
        if (emailExists.rowCount > 0)
            throw boom_1.default.notAcceptable('Email already in use.');
        const saltRounds = 10;
        const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
        const verificationCode = (0, uuid_1.v4)();
        const result = yield users_1.default.addNew(username, passwordHash, email, knownLanguageId, learnLanguageId, verificationCode);
        const newUser = (0, types_1.convertUserTypes)(result.rows[0]);
        if (newUser.id) {
            yield texts_1.default.addMatchGirlToUser(newUser.id, learnLanguageId);
        }
        if (process.env.NODE_ENV !== 'test')
            yield sendmail_1.default.sendVerificationEmail(verificationCode, email, username);
        return sanitizeUser(newUser);
    });
};
const updateUserInfo = function (userId, userName, email) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.updateUserInfo(userId, userName, email);
        if (result.rowCount === 0)
            throw boom_1.default.notAcceptable('Something went wrong');
        const updatedUser = (0, types_1.convertUserTypes)(result.rows[0]);
        return sanitizeUser(updatedUser);
    });
};
const updatePassword = function (userId, currentPassword, newPassword) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (!currentPassword) {
            throw boom_1.default.notAcceptable('You must submit your current password.');
        }
        else if (!newPassword) {
            throw boom_1.default.notAcceptable('You must submit a new password.');
        }
        const passwordsMatch = yield verifyPassword(userId, currentPassword);
        if (passwordsMatch) {
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(newPassword, saltRounds);
            const result = yield users_1.default.updatePassword(userId, passwordHash);
            if (result.rowCount === 1) {
                return { message: 'Your password has been updated' };
            }
        }
        throw boom_1.default.notAcceptable('Incorrect password.');
    });
};
const setUserLanguages = function (knownLanguageId, learnLanguageId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.setUserLanguages(knownLanguageId, learnLanguageId, userId);
        if (result.rowCount === 0)
            throw boom_1.default.notAcceptable('Something went wrong');
        const updatedUser = (0, types_1.convertUserTypes)(result.rows[0]);
        return sanitizeUser(updatedUser);
    });
};
const remove = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.remove(userId);
        if (result.rowCount > 0) {
            const deletedUser = result.rows[0];
            return sanitizeUser(deletedUser);
        }
        throw boom_1.default.unauthorized('Something went wrong');
    });
};
const verify = function (code, token) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        if (typeof decodedToken === 'string') {
            let result = yield users_1.default.getByEmail(decodedToken);
            if (result.rowCount === 0)
                throw boom_1.default.notFound('cannot find user with this email');
            const foundUser = (0, types_1.convertUserTypes)(result.rows[0]);
            if (foundUser.verificationCode !== code)
                throw boom_1.default.unauthorized('invalid verification code');
            result = yield users_1.default.verify(Number(foundUser.id));
            if (result.rowCount === 0)
                throw boom_1.default.notFound('cannot verify user');
            const verifiedUser = (0, types_1.convertUserTypes)(result.rows[0]);
            return sanitizeUser(verifiedUser);
        }
        throw boom_1.default.unauthorized('invalid token');
    });
};
exports.default = {
    sanitizeUser,
    isAdmin,
    getAll,
    addNew,
    updatePassword,
    remove,
    getById,
    verifyPassword,
    verify,
    setUserLanguages,
    updateUserInfo,
};
