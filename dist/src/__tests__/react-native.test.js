"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("../generators/react-native");
var test_generator_1 = require("./test-generator");
describe('React Native', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'reactNative', generator: react_native_1.componentToReactNative });
});
