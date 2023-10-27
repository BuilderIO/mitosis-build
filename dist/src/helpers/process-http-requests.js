"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processHttpRequests = void 0;
function processHttpRequests(json) {
    var _a, _b;
    var httpRequests = (_b = (_a = json === null || json === void 0 ? void 0 : json.meta) === null || _a === void 0 ? void 0 : _a.useMetadata) === null || _b === void 0 ? void 0 : _b.httpRequests;
    if (httpRequests) {
        for (var key in httpRequests) {
            if (!json.state[key]) {
                json.state[key] = { code: 'null', type: 'property', propertyType: 'normal' };
            }
            var value = httpRequests[key];
            // TODO: unravel our proxy. aka parse out methods, header, etc
            // and remove our proxy from being used anymore
            json.hooks.onMount.push({
                code: "\n        fetch(\"".concat(value, "\").then(res => res.json()).then(result => {\n          state.").concat(key, " = result;\n        })\n        "),
            });
        }
    }
}
exports.processHttpRequests = processHttpRequests;
