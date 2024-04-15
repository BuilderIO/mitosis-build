"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppropriateTemplateFunctionKeys = exports.HELPER_FUNCTIONS = void 0;
exports.HELPER_FUNCTIONS = {
    useObjectWrapper: "useObjectWrapper(...args: any[]) {\n        let obj = {}\n        args.forEach((arg) => {\n          obj = { ...obj, ...arg };\n        });\n        return obj;\n      }",
    useObjectDotValues: "useObjectDotValues(obj: any): any[] {\n        return Object.values(obj);\n      }",
    useTypeOf: "useTypeOf(obj: any): string {\n        return typeof obj;\n      }",
    useJsonStringify: "useJsonStringify(obj: any): string {\n        return JSON.stringify(obj);\n      }",
};
var getAppropriateTemplateFunctionKeys = function (code) {
    return Object.keys(exports.HELPER_FUNCTIONS).filter(function (key) { return code.includes(key); });
};
exports.getAppropriateTemplateFunctionKeys = getAppropriateTemplateFunctionKeys;
