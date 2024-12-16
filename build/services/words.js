"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const words_1 = (0, tslib_1.__importDefault)(require("../data-access/words"));
const translations_1 = (0, tslib_1.__importDefault)(require("./translations"));
const types_1 = require("../types");
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.getAll();
        return result.rows.map((dbItem) => (0, types_1.convertWordTypes)(dbItem));
    });
};
const getUserwordsInText = function (userId, textId, targetLanguageId, simple = true) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const wordsResult = yield words_1.default.getUserwordsInText(userId, textId, targetLanguageId, simple);
        const rawUserWords = wordsResult.rows;
        const userWords = rawUserWords.map((rawWord) => ({
            id: rawWord.word_id,
            word: rawWord.word,
            status: rawWord.status,
            translations: rawWord.translation_ids.map((id, index) => ({
                id,
                wordId: rawWord.word_id,
                targetLanguageId,
                translation: rawWord.translation_texts[index],
                context: rawWord.translation_contexts[index],
            })),
        }));
        return userWords;
    });
};
const getUserwordsByLanguage = function (languageId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const wordsResult = yield words_1.default.getUserwordsByLanguage(languageId, userId);
        const rawUserWords = wordsResult.rows;
        const userWords = rawUserWords.map((rawWord) => ({
            id: rawWord.word_id,
            word: rawWord.word,
            status: rawWord.status,
            translations: rawWord.translation_ids.map((id, index) => ({
                id,
                wordId: rawWord.word_id,
                targetLanguageId: rawWord.language_ids[index],
                translation: rawWord.translation_texts[index],
                context: rawWord.translation_contexts[index],
            })),
        }));
        return userWords;
    });
};
const getWordInLanguage = function (word, languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.getWordInLanguage(word, languageId);
        if (result.rowCount === 0)
            return null;
        return (0, types_1.convertWordTypes)(result.rows[0]);
    });
};
const addNew = function (wordObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.addNew(wordObject);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not add new word.');
        return (0, types_1.convertWordTypes)(result.rows[0]);
    });
};
const getStatus = function (wordId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.getStatus(wordId, userId);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not get word status.');
        return result.rows[0].word_status;
    });
};
const addStatus = function (wordId, userId, wordStatus) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.addStatus(wordId, userId, wordStatus);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not add status to word.');
        return result.rows[0].word_status;
    });
};
const addNewUserWord = function (user, userWordData) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const returnUserWord = userWordData;
        const newWordData = {
            word: userWordData.word,
            languageId: user.learnLanguageId,
        };
        const newWord = yield addNew(newWordData);
        if (newWord.id && user.id) {
            returnUserWord.id = newWord.id;
            yield addStatus(newWord.id, user.id, userWordData.status);
            const uwdTranslation = userWordData.translations[0];
            const newTranslation = yield translations_1.default.add(newWord.id, uwdTranslation.translation, uwdTranslation.targetLanguageId);
            if (newTranslation.id) {
                returnUserWord.translations[0].id = newTranslation.id;
                yield translations_1.default.addToUsersTranslations(user.id, newTranslation.id, uwdTranslation.context);
            }
        }
        return returnUserWord;
    });
};
const updateStatus = function (wordId, userId, wordStatus) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.updateStatus(wordId, userId, wordStatus);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not update word status.');
        return result.rows[0].word_status;
    });
};
const remove = function (wordId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.remove(wordId);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not remove word.');
        return (0, types_1.convertWordTypes)(result.rows[0]);
    });
};
const removeUserWord = function (wordId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield words_1.default.removeUserWord(wordId, userId);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not remove status.');
        return result.rows[0].word_status;
    });
};
exports.default = {
    getAll,
    getUserwordsInText,
    getUserwordsByLanguage,
    getWordInLanguage,
    addNew,
    getStatus,
    addStatus,
    updateStatus,
    removeUserWord,
    addNewUserWord,
    remove,
};
