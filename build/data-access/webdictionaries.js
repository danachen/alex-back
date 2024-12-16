"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getBySource = function getBySourceLanguage(sourceLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const DICTIONARIES_BY_SOURCE = `
    SELECT * FROM webdictionaries
     WHERE source_language_id = %L`;
        const result = yield (0, db_query_1.default)(DICTIONARIES_BY_SOURCE, sourceLanguageId);
        return result;
    });
};
const getBySourceTarget = function getBySourceLanguage(sourceLanguageId, targetLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const DICTIONARIES_BY_SOURCE_TARGET = `
    SELECT * FROM webdictionaries
     WHERE source_language_id = %L
       AND target_language_id = %L`;
        const result = yield (0, db_query_1.default)(DICTIONARIES_BY_SOURCE_TARGET, sourceLanguageId, targetLanguageId);
        return result;
    });
};
exports.default = {
    getBySource,
    getBySourceTarget,
};
