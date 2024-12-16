"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const languages_1 = (0, tslib_1.__importDefault)(require("./languages"));
// Returning all words in the database is only needed in tests
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ALL_WORDS = `
    SELECT * FROM words`;
        const result = yield (0, db_query_1.default)(ALL_WORDS);
        return result;
    });
};
const getWordInLanguage = function (word, languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const WORD_BY_LANGUAGE_AND_WORD = `
    SELECT * FROM words 
     WHERE language_id = %L 
           AND 
           word = %L`;
        const result = yield (0, db_query_1.default)(WORD_BY_LANGUAGE_AND_WORD, languageId, word);
        return result;
    });
};
// Finds all words in a text that a user has previously marked and returns translations and contexts as well
const getUserwordsInText = function (userId, textId, targetLanguageId, simple = true) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const tsvectorType = simple ? 'simple' : 'language';
        const USER_WORDS_IN_TEXT = `
      SELECT DISTINCT w.id AS word_id, 
                      w.word, 
                      array_agg(t.id) AS translation_ids,
                      array_agg(t.translation) AS translation_texts,
                      array_agg(ut.context) AS translation_contexts, 
                      uw.word_status AS status
        FROM words AS w 
        JOIN translations AS t ON w.id = t.word_id 
        JOIN users_translations AS ut ON t.id = ut.translation_id 
        JOIN users_words AS uw ON w.id = uw.word_id 
       WHERE uw.user_id = %s 
             AND 
             ut.user_id = %s 
             AND
             t.target_language_id = %L 
             AND
             w.language_id = (SELECT t.language_id FROM texts AS t 
                               WHERE t.id = %s)
             AND
             w.tsquery_${tsvectorType} @@ (SELECT t.tsvector_${tsvectorType} FROM texts AS t 
                                            WHERE t.id = %s)        
    GROUP BY w.id, w.word, uw.word_status`;
        const result = yield (0, db_query_1.default)(USER_WORDS_IN_TEXT, userId, userId, targetLanguageId, textId, textId);
        return result;
    });
};
// Finds all words a user has marked in a given language and returns translations and contexts as well
const getUserwordsByLanguage = function (languageId, userId, simple = true) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        let tsvectorType = 'simple';
        let tsConfig = 'simple';
        if (!simple) {
            tsvectorType = 'language';
            const result = yield languages_1.default.getById(languageId);
            tsConfig = result.rows[0].name;
        }
        const WORDS_BY_LANGUAGE_AND_USER = `
      SELECT DISTINCT w.id AS word_id, 
                      w.word, 
                      array_agg(t.id) AS translation_ids,
                      array_agg(t.target_language_id) AS language_ids,
                      array_agg(t.translation) AS translation_texts, 
                      array_agg(ts_headline('${tsConfig}', 
                                            ut.context, 
                                            w.tsquery_${tsvectorType}, 
                                            'StartSel=<strong>, StopSel=</strong> MaxWords=35, MinWords=20')) AS translation_contexts, 
                      uw.word_status AS status
        FROM words AS w 
        JOIN translations AS t ON w.id = t.word_id 
        JOIN users_translations AS ut ON t.id = ut.translation_id 
        JOIN users_words AS uw ON w.id = uw.word_id 
       WHERE uw.user_id = %s 
             AND 
             ut.user_id = %s 
             AND
             w.language_id = %L 
    GROUP BY w.id, w.word, uw.word_status
    ORDER BY w.word ASC`;
        const result = yield (0, db_query_1.default)(WORDS_BY_LANGUAGE_AND_USER, userId, userId, languageId);
        return result;
    });
};
const addNew = function (wordObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { languageId, word, } = wordObject;
        const existingWord = yield getWordInLanguage(word, languageId);
        if (existingWord.rowCount > 0) {
            return existingWord;
        }
        const ADD_WORD = `
    INSERT INTO words (language_id, word, ts_config)
         VALUES (%L, %L, (SELECT "name" FROM languages AS l WHERE l.id = %L)::regconfig)
      RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_WORD, languageId, word, languageId);
        return result;
    });
};
// Retrieves word status string for given user
const getStatus = function (wordId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const USER_WORD_STATUS = `
    SELECT word_status FROM users_words 
     WHERE user_id = %s 
           AND
           word_id = %s`;
        const result = yield (0, db_query_1.default)(USER_WORD_STATUS, userId, wordId);
        return result;
    });
};
const addStatus = function (wordId, userId, wordStatus) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const existingStatus = yield getStatus(wordId, userId);
        if (existingStatus.rowCount > 0) {
            return existingStatus;
        }
        const ADD_USER_WORD_STATUS = `
    INSERT INTO users_words (user_id, word_id, word_status)
         VALUES (%s, %s, %L)
      RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_USER_WORD_STATUS, userId, wordId, wordStatus);
        return result;
    });
};
const updateStatus = function (wordId, userId, wordStatus) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_USER_WORD_STATUS = `
       UPDATE users_words 
          SET word_status = %L 
        WHERE user_id = %L 
              AND
              word_id = %L
    RETURNING *`;
        const result = yield (0, db_query_1.default)(UPDATE_USER_WORD_STATUS, wordStatus, userId, wordId);
        return result;
    });
};
const removeUserWord = function (wordId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const REMOVE_USER_WORD = `
    DELETE FROM users_words 
          WHERE user_id = %s 
            AND word_id = %s
    RETURNING *`;
        const result = yield (0, db_query_1.default)(REMOVE_USER_WORD, userId, wordId);
        return result;
    });
};
const remove = function (wordId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const DELETE_WORD = `
       DELETE FROM words
        WHERE id = %s
    RETURNING *`;
        const result = yield (0, db_query_1.default)(DELETE_WORD, wordId);
        return result;
    });
};
exports.default = {
    getAll,
    getUserwordsByLanguage,
    getUserwordsInText,
    getWordInLanguage,
    addNew,
    getStatus,
    addStatus,
    updateStatus,
    removeUserWord,
    remove,
};
