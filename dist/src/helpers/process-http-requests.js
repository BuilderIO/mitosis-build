"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processHttpRequests = void 0;
function processHttpRequests(json) {
    var _a, _b, _c;
    var httpRequests = (_b = (_a = json === null || json === void 0 ? void 0 : json.meta) === null || _a === void 0 ? void 0 : _a.useMetadata) === null || _b === void 0 ? void 0 : _b.httpRequests;
    var onMount = ((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) ? json.hooks.onMount : { code: '' };
    if (httpRequests) {
        for (var key in httpRequests) {
            if (!json.state[key]) {
                json.state[key] = { code: 'null', type: 'property', propertyType: 'normal' };
            }
            var value = httpRequests[key];
            // TODO: unravel our proxy. aka parse out methods, header, etc
            // and remove our proxy from being used anymore
            onMount.code += "\n        fetch(\"".concat(value, "\").then(res => res.json()).then(result => {\n          state.").concat(key, " = result;\n        })\n      ");
        }
    }
    json.hooks.onMount = onMount;
}
exports.processHttpRequests = processHttpRequests;
