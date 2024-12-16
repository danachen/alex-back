"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ALL_LANGUAGES = `
    SELECT * FROM languages`;
        const result = yield (0, db_query_1.default)(ALL_LANGUAGES);
        return result;
    });
};
const getById = function (languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const LANGUAGE_BY_ID = `
    SELECT * FROM languages WHERE id = %L`;
        const result = yield (0, db_query_1.default)(LANGUAGE_BY_ID, languageId);
        return result;
    });
};
exports.default = {
    getAll,
    getById,
};
