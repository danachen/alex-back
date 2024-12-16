"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webdictionaries_1 = (0, tslib_1.__importDefault)(require("../data-access/webdictionaries"));
const types_1 = require("../types");
const getBySourceTarget = function (sourceLanguageId, targetLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default
            .getBySourceTarget(sourceLanguageId, targetLanguageId);
        if (result.rowCount === 0) {
            const alternativeResult = yield webdictionaries_1.default.getBySource(sourceLanguageId);
            return alternativeResult.rows
                .map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
        }
        return result.rows.map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
    });
};
exports.default = {
    getBySourceTarget,
};
