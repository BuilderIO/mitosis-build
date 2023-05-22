"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStyle = exports.useDefaultProps = exports.useMetadata = exports.onError = exports.useDynamicTag = exports.onUnMount = exports.onInit = exports.onUpdate = exports.onMount = exports.setContext = exports.createContext = exports.useContext = exports.useRef = exports.useState = exports.useStore = void 0;
__exportStar(require("./flow"), exports);
function Provider(props) {
    return null;
}
// These compile away
var useStore = function (obj) {
    throw new Error('useStore: Mitosis hook should have been compiled away');
    return obj;
};
exports.useStore = useStore;
var useState = function (obj) {
    throw new Error('useState: Mitosis hook should have been compiled away');
    return null;
};
exports.useState = useState;
var useRef = function (obj) {
    throw new Error('useRef: Mitosis hook should have been compiled away');
    return obj;
};
exports.useRef = useRef;
var useContext = function (key) { return null; };
exports.useContext = useContext;
var createContext = function (value) {
    return null;
};
exports.createContext = createContext;
var setContext = function (key, value) { };
exports.setContext = setContext;
var onMount = function (fn) {
    throw new Error('onMount: Mitosis hook should have been compiled away');
    return null;
};
exports.onMount = onMount;
var onUpdate = function (fn, deps) { return null; };
exports.onUpdate = onUpdate;
var onInit = function (fn) { return null; };
exports.onInit = onInit;
var onUnMount = function (fn) { return null; };
exports.onUnMount = onUnMount;
var useDynamicTag = function (fn) { return null; };
exports.useDynamicTag = useDynamicTag;
var onError = function (fn) { return null; };
exports.onError = onError;
var useMetadata = function (obj) {
    throw new Error('useMetadata: Mitosis hook should have been compiled away');
    return null;
};
exports.useMetadata = useMetadata;
var useDefaultProps = function (value) { return null; };
exports.useDefaultProps = useDefaultProps;
var useStyle = function (value) { return null; };
exports.useStyle = useStyle;
__exportStar(require("./parsers/jsx"), exports);
__exportStar(require("./parsers/svelte"), exports);
__exportStar(require("./parsers/builder"), exports);
__exportStar(require("./parsers/angular"), exports);
__exportStar(require("./parsers/context"), exports);
__exportStar(require("./generators/vue"), exports);
__exportStar(require("./generators/alpine"), exports);
__exportStar(require("./generators/angular"), exports);
__exportStar(require("./generators/context/react"), exports);
__exportStar(require("./generators/context/qwik"), exports);
__exportStar(require("./generators/context/rsc"), exports);
__exportStar(require("./generators/context/solid"), exports);
__exportStar(require("./generators/context/vue"), exports);
__exportStar(require("./generators/context/svelte"), exports);
__exportStar(require("./generators/react"), exports);
__exportStar(require("./generators/rsc"), exports);
__exportStar(require("./generators/solid"), exports);
__exportStar(require("./generators/liquid"), exports);
__exportStar(require("./generators/builder"), exports);
__exportStar(require("./generators/qwik/index"), exports);
__exportStar(require("./symbols/symbol-processor"), exports);
__exportStar(require("./generators/html"), exports);
__exportStar(require("./generators/svelte"), exports);
__exportStar(require("./generators/stencil"), exports);
__exportStar(require("./generators/marko"), exports);
__exportStar(require("./generators/mitosis"), exports);
__exportStar(require("./generators/template"), exports);
__exportStar(require("./generators/swift-ui"), exports);
__exportStar(require("./generators/lit"), exports);
__exportStar(require("./generators/react-native"), exports);
__exportStar(require("./generators/taro"), exports);
__exportStar(require("./helpers/is-mitosis-node"), exports);
__exportStar(require("./types/mitosis-node"), exports);
__exportStar(require("./types/mitosis-component"), exports);
__exportStar(require("./types/config"), exports);
__exportStar(require("./types/transpiler"), exports);
__exportStar(require("./types/plugins"), exports);
__exportStar(require("./plugins/compile-away-builder-components"), exports);
__exportStar(require("./plugins/compile-away-components"), exports);
__exportStar(require("./plugins/map-styles"), exports);
__exportStar(require("./targets"), exports);
