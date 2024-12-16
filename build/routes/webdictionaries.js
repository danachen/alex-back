"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const webdictionaries_1 = (0, tslib_1.__importDefault)(require("../services/webdictionaries"));
const webdictionariesRouter = express_1.default.Router();
webdictionariesRouter.get('/source/:sourceId/target/:targetId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const cacheDuration = 60 * 60 * 24 * 7; // one week
    res.set('Cache-control', `public, max-age=${cacheDuration}`);
    const { sourceId, targetId } = req.params;
    const webdictionaryList = yield webdictionaries_1.default
        .getBySourceTarget(sourceId, targetId);
    res.json(webdictionaryList);
}));
exports.default = webdictionariesRouter;
