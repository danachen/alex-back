"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_TRANSLATIONS = 'SELECT * FROM translations';
        const results = yield (0, db_query_1.default)(FIND_TRANSLATIONS);
        return results;
    });
};
const add = function (wordId, translation, targetLang) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L) RETURNING *';
        const results = yield (0, db_query_1.default)(INSERT_TRANSLATION, wordId, translation, targetLang);
        return results;
    });
};
const update = function (translationId, translation) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_TRANSLATION = 'UPDATE translations SET translation = %L WHERE id = %L RETURNING translations.*';
        const result = yield (0, db_query_1.default)(UPDATE_TRANSLATION, translation, translationId);
        return result;
    });
};
const getUserTranslationContext = function (userId, translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const USER_TRANSLATION = 'SELECT context FROM users_translations WHERE user_id = %s AND translation_id = %s';
        const result = yield (0, db_query_1.default)(USER_TRANSLATION, userId, translationId);
        return result;
    });
};
const remove = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const REMOVE_USERS_TRANSLATIONS = 'DELETE FROM users_translations WHERE translation_id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(REMOVE_USERS_TRANSLATIONS, translationId);
        return result;
    });
};
const addToUsersTranslations = function (userId, translationId, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id, context) VALUES(%L, %L, %L) RETURNING *';
        const result = yield (0, db_query_1.default)(USER_TRANSLATION, userId, translationId, context);
        return result;
    });
};
exports.default = {
    getAll,
    add,
    addToUsersTranslations,
    update,
    remove,
    getUserTranslationContext,
};
