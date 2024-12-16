"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const translations_1 = (0, tslib_1.__importDefault)(require("../data-access/translations"));
const types_1 = require("../types");
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const results = yield translations_1.default.getAll();
        return results.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem));
    });
};
const add = function (wordId, translation, targetLang) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.add(wordId, translation, targetLang);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Adding new translation not successful.');
        return (0, types_1.convertTranslationTypes)(result.rows[0]);
    });
};
const update = function (translationId, translation) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.update(translationId, translation);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Updating translation with given translation id not successful.');
        return (0, types_1.convertTranslationTypes)(result.rows[0]);
    });
};
const getUserTranslationContext = function (userId, translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default
            .getUserTranslationContext(userId, translationId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('No connection between user and translation');
        return result.rows[0] || '';
    });
};
const remove = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.remove(translationId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Removing translation not successful.');
        return (0, types_1.convertTranslationTypes)(result.rows[0]);
    });
};
const addToUsersTranslations = function (userId, translationId, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default
            .addToUsersTranslations(userId, translationId, context);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Connecting user and translation not successful.');
        return result.rows[0].context;
    });
};
exports.default = {
    getAll,
    add,
    addToUsersTranslations,
    getUserTranslationContext,
    update,
    remove,
};
