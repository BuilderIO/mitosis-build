"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkShouldOutputTypeScript = void 0;
var nullable_1 = require("./nullable");
var checkShouldOutputTypeScript = function (_a) {
    var _b;
    var target = _a.target, options = _a.options;
    var targetTsConfig = (_b = options.options[target]) === null || _b === void 0 ? void 0 : _b.typescript;
    return (0, nullable_1.checkIsDefined)(targetTsConfig) ? targetTsConfig : false;
};
exports.checkShouldOutputTypeScript = checkShouldOutputTypeScript;
