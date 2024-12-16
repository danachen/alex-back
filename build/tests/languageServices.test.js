"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const languages_1 = (0, tslib_1.__importDefault)(require("../services/languages"));
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
describe('Getting languages', () => {
    test('getAll: get all 15 languages from test database', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const allTexts = yield languages_1.default.getAll();
        expect(allTexts).toHaveLength(10);
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
