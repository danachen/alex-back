"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTranslationTypes = exports.convertWebdictionaryTypes = exports.convertWordTypes = exports.convertTextTypes = exports.convertUserTypes = exports.convertLanguageTypes = void 0;
const convertLanguageTypes = function (dbItem) {
    return {
        id: dbItem.id,
        name: dbItem.name,
        flag: dbItem.flag,
        eachCharIsWord: dbItem.each_char_is_word,
        isRightToLeft: dbItem.is_right_to_left,
    };
};
exports.convertLanguageTypes = convertLanguageTypes;
const convertUserTypes = function (dbItem) {
    return {
        id: dbItem.id,
        username: dbItem.username,
        passwordHash: dbItem.password_hash,
        email: dbItem.email,
        knownLanguageId: dbItem.known_language_id,
        learnLanguageId: dbItem.learn_language_id,
        verified: dbItem.verified,
        verificationCode: dbItem.verification_code,
    };
};
exports.convertUserTypes = convertUserTypes;
const convertTextTypes = function (dbItem) {
    return {
        id: dbItem.id,
        userId: dbItem.user_id,
        languageId: dbItem.language_id,
        title: dbItem.title,
        author: dbItem.author,
        body: dbItem.body,
        sourceURL: dbItem.source_url,
        sourceType: dbItem.source_type,
        uploadTime: new Date(dbItem.upload_time),
        isPublic: dbItem.is_public,
    };
};
exports.convertTextTypes = convertTextTypes;
const convertWordTypes = function (dbItem) {
    return {
        id: dbItem.id,
        languageId: dbItem.language_id,
        word: dbItem.word,
    };
};
exports.convertWordTypes = convertWordTypes;
const convertWebdictionaryTypes = function (dbItem) {
    return {
        id: dbItem.id,
        sourceLanguageId: dbItem.source_language_id,
        targetLanguageId: dbItem.target_language_id,
        name: dbItem.name,
        url: dbItem.url,
    };
};
exports.convertWebdictionaryTypes = convertWebdictionaryTypes;
const convertTranslationTypes = function (dbItem) {
    return {
        id: dbItem.id,
        wordId: dbItem.word_id,
        translation: dbItem.translation,
        targetLanguageId: dbItem.target_language_id,
    };
};
exports.convertTranslationTypes = convertTranslationTypes;
