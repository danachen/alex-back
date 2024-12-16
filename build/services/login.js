"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
const users_1 = (0, tslib_1.__importDefault)(require("../data-access/users"));
const users_2 = (0, tslib_1.__importDefault)(require("./users"));
const types_1 = require("../types");
const verifyLoginDetails = function (email, password) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getByEmail(email);
        const user = result.rowCount > 0 ? result.rows[0] : null;
        const passwordsMatch = user
            ? yield bcrypt_1.default.compare(password, user.password_hash)
            : false;
        if (!(user && passwordsMatch)) {
            throw boom_1.default.unauthorized('invalid email or password');
        }
        return user;
    });
};
const login = function (email, password) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const verifiedUser = (0, types_1.convertUserTypes)(yield verifyLoginDetails(email, password));
        const sanitizedUser = users_2.default.sanitizeUser(verifiedUser);
        const userForToken = {
            email: verifiedUser.email,
            id: verifiedUser.id,
        };
        const token = jsonwebtoken_1.default.sign(userForToken, String(process.env.SECRET), { expiresIn: 60 * 60 * 24 * 7 });
        const loggedInUser = Object.assign(Object.assign({}, sanitizedUser), { token });
        return loggedInUser;
    });
};
exports.default = {
    login,
};
