"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextToVue = void 0;
function contextToVue(context, options) {
    if (options === void 0) { options = {}; }
    var str = "\n    // Noop file\n    export default {};\n  ";
    return str;
}
exports.contextToVue = contextToVue;
