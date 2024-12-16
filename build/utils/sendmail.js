"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendVerificationEmail = function (code, email, name) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign(email, String(process.env.SECRET));
        const mail = {
            to: email,
            from: 'noreply@tryalexandria.com',
            subject: 'Verify your email address for Alexandria',
            text: `Text version of the link: ${process.env.SERVER_URL}/verify/${code}/${token}`,
            html: `
    <h3>Hello, ${name}!</h3>
    <p>Please follow this link to verify the email address you used to sign up for Alexandria:</p>
    <p><a href="${process.env.SERVER_URL}/verify/${code}/${token}">Verify ${email}</a></p>
    <p>You can then start to add your own texts.</p>
    <p>Greetings from team Alexandria</p>`,
        };
        const response = yield sgMail.send(mail);
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    });
};
exports.default = {
    sendVerificationEmail,
};
