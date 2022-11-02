"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUNCTION_HACK_PLUGIN = void 0;
var patterns_1 = require("../../helpers/patterns");
var FUNCTION_HACK_PLUGIN = function () { return ({
    json: {
        pre: function (json) {
            var _a, _b;
            for (var key in json.state) {
                var value = (_a = json.state[key]) === null || _a === void 0 ? void 0 : _a.code;
                var type = (_b = json.state[key]) === null || _b === void 0 ? void 0 : _b.type;
                if (typeof value === 'string' && type === 'method') {
                    var newValue = (0, patterns_1.prefixWithFunction)(value);
                    json.state[key] = {
                        code: newValue,
                        type: 'method',
                    };
                }
                else if (typeof value === 'string' && type === 'function') {
                    json.state[key] = {
                        code: value,
                        type: 'method',
                    };
                }
            }
        },
    },
}); };
exports.FUNCTION_HACK_PLUGIN = FUNCTION_HACK_PLUGIN;
