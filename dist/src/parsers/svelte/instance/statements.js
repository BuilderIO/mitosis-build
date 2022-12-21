"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStatementAtProgramLevel = void 0;
var astring_1 = require("astring");
var hooks_1 = require("../helpers/hooks");
function parseStatementAtProgramLevel(json, node) {
    var statement = (0, astring_1.generate)(node);
    (0, hooks_1.addToOnInitHook)(json, statement);
}
exports.parseStatementAtProgramLevel = parseStatementAtProgramLevel;
