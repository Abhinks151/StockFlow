"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = exports.HTTP_STATUS = void 0;
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
var messages_1 = require("./messages");
Object.defineProperty(exports, "MESSAGES", { enumerable: true, get: function () { return messages_1.MESSAGES; } });
