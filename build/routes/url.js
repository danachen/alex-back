"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const article_parser_1 = require("article-parser");
const router = express_1.default.Router();
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const timer = setTimeout(() => res.status(204).send(), 2000);
    try {
        const article = yield (0, article_parser_1.extract)(url);
        clearTimeout(timer);
        res.json(article);
    }
    catch (error) {
        console.trace(error);
    }
}));
exports.default = router;
