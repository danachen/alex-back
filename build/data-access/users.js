"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const isAdmin = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_USER_IN_ADMINS = 'SELECT * FROM admins WHERE user_id = %s';
        const result = yield (0, db_query_1.default)(FIND_USER_IN_ADMINS, userId);
        return result;
    });
};
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const SELECT_ALL_USERS = 'SELECT * FROM users';
        const result = yield (0, db_query_1.default)(SELECT_ALL_USERS);
        return result;
    });
};
const getById = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const findUserById = 'SELECT * FROM users WHERE id = %L';
        const result = yield (0, db_query_1.default)(findUserById, userId);
        return result;
    });
};
const getByEmail = function (email) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const CHECK_EMAIL = 'SELECT * FROM users WHERE email = %L';
        const result = yield (0, db_query_1.default)(CHECK_EMAIL, email);
        return result;
    });
};
const addNew = function (username, passwordHash, email, knownLanguageId, learnLanguageId, verificationCode) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ADD_USER = 'INSERT INTO users (username, password_hash, email, known_language_id, learn_language_id, verification_code) Values (%L, %L, %L, %L, %L, %L) RETURNING *';
        const result = yield (0, db_query_1.default)(ADD_USER, username, passwordHash, email, knownLanguageId, learnLanguageId, verificationCode);
        return result;
    });
};
const updateUserInfo = function (userId, userName, email) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_INFO = 'UPDATE users SET username = %L, email = %L WHERE id = %L RETURNING *;';
        const result = yield (0, db_query_1.default)(UPDATE_INFO, userName, email, userId);
        return result;
    });
};
const updatePassword = function (userId, newPasswordHash) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_PASSWORD = 'UPDATE users SET password_hash = %L WHERE id = %L';
        const result = yield (0, db_query_1.default)(UPDATE_PASSWORD, newPasswordHash, userId);
        return result;
    });
};
const setUserLanguages = function (knownLanguageId, learnLanguageId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const setKnownLanguage = 'UPDATE users SET known_language_id = %L, learn_language_id = %L WHERE id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(setKnownLanguage, knownLanguageId, learnLanguageId, userId);
        return result;
    });
};
const remove = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const deleteUser = 'DELETE FROM users WHERE id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(deleteUser, userId);
        return result;
    });
};
const verify = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const VERIFY = 'UPDATE users SET verified = true WHERE id = %s RETURNING *';
        const result = yield (0, db_query_1.default)(VERIFY, userId);
        return result;
    });
};
exports.default = {
    isAdmin,
    getAll,
    getByEmail,
    addNew,
    getById,
    remove,
    setUserLanguages,
    updatePassword,
    updateUserInfo,
    verify,
};
