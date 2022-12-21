"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCss = void 0;
var parseCss = function (ast, json) {
    var _a;
    json.style = (_a = ast.css) === null || _a === void 0 ? void 0 : _a.content.styles;
};
exports.parseCss = parseCss;
