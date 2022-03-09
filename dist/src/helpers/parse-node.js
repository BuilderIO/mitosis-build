"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNodes = exports.parseNode = void 0;
var jsx_1 = require("../parsers/jsx");
var parseNode = function (str) {
    return (0, jsx_1.parseJsx)("\n    export default function MyComponent() {\n      return (".concat(str, ")\n    }\n  ")).children[0];
};
exports.parseNode = parseNode;
var parseNodes = function (str) {
    return (0, jsx_1.parseJsx)("\n    export default function MyComponent() {\n      return (<>".concat(str, "</>)\n    }\n  ")).children[0].children;
};
exports.parseNodes = parseNodes;
