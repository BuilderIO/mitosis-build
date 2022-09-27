"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("../generators/react-native");
var shared_1 = require("./shared");
describe('React Native', function () {
    (0, shared_1.runTestsForTarget)('reactNative', (0, react_native_1.componentToReactNative)());
});
