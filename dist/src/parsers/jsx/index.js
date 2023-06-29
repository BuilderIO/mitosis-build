"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSignalTypeInTSFile = exports.createTypescriptProject = exports.parseJsx = void 0;
var jsx_1 = require("./jsx");
Object.defineProperty(exports, "parseJsx", { enumerable: true, get: function () { return jsx_1.parseJsx; } });
var types_identification_1 = require("./types-identification");
Object.defineProperty(exports, "createTypescriptProject", { enumerable: true, get: function () { return types_identification_1.createTypescriptProject; } });
Object.defineProperty(exports, "mapSignalTypeInTSFile", { enumerable: true, get: function () { return types_identification_1.mapSignalTypeInTSFile; } });
