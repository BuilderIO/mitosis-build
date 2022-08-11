"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processHttpRequests = void 0;
function processHttpRequests(json) {
    var _a, _b;
    var httpRequests = (_a = json.meta.useMetadata) === null || _a === void 0 ? void 0 : _a.httpRequests;
    var onMount = ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? json.hooks.onMount : { code: '' };
    if (httpRequests) {
        for (var key in httpRequests) {
            if (!json.state[key]) {
                json.state[key] = { code: null, type: 'property' };
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
