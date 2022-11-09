"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestsForTarget = exports.runTestsForJsx = void 0;
var jsx_1 = require("../parsers/jsx");
var getRawFile = function (path) { return Promise.resolve().then(function () { return __importStar(require("".concat(path, ".tsx?raw"))); }).then(function (x) { return x.default; }); };
var basicForShow = getRawFile('./data/basic-for-show.raw');
var basicBooleanAttribute = getRawFile('./data/basic-boolean-attribute.raw');
var basicOnMountUpdate = getRawFile('./data/basic-onMount-update.raw');
var basicContext = getRawFile('./data/basic-context.raw');
var basicOutputsMeta = getRawFile('./data/basic-outputs-meta.raw');
var basicOutputs = getRawFile('./data/basic-outputs.raw');
var subComponent = getRawFile('./data/sub-component.raw');
var componentWithContext = getRawFile('./data/context/component-with-context.raw');
var basic = getRawFile('./data/basic.raw');
var basicAttribute = getRawFile('./data/basic-attribute.raw');
var basicMitosis = getRawFile('./data/basic-custom-mitosis-package.raw');
var basicChildComponent = getRawFile('./data/basic-child-component.raw');
var basicFor = getRawFile('./data/basic-for.raw');
var basicRef = getRawFile('./data/basic-ref.raw');
var basicForwardRef = getRawFile('./data/basic-forwardRef.raw');
var basicForwardRefMetadata = getRawFile('./data/basic-forwardRef-metadata.raw');
var basicRefPrevious = getRawFile('./data/basic-ref-usePrevious.raw');
var basicRefAssignment = getRawFile('./data/basic-ref-assignment.raw');
var propsDestructure = getRawFile('./data/basic-props-destructure.raw');
var nestedStyles = getRawFile('./data/nested-styles.raw');
var preserveExportOrLocalStatement = getRawFile('./data/basic-preserve-export-or-local-statement.raw');
var arrowFunctionInUseStore = getRawFile('./data/arrow-function-in-use-store.raw');
var propsType = getRawFile('./data/types/component-props-type.raw');
var propsInterface = getRawFile('./data/types/component-props-interface.raw');
var preserveTyping = getRawFile('./data/types/preserve-typing.raw');
var typeDependency = getRawFile('./data/types/type-dependency.raw');
var defaultProps = getRawFile('./data/default-props/default-props.raw');
var defaultPropsOutsideComponent = getRawFile('./data/default-props/default-props-outside-component.raw');
var classRaw = getRawFile('./data/styles/class.raw');
var className = getRawFile('./data/styles/className.raw');
var classAndClassName = getRawFile('./data/styles/class-and-className.raw');
var classState = getRawFile('./data/styles/classState.raw');
var useStyle = getRawFile('./data/styles/use-style.raw');
var useStyleOutsideComponent = getRawFile('./data/styles/use-style-outside-component.raw');
var useStyleAndCss = getRawFile('./data/styles/use-style-and-css.raw');
var button = getRawFile('./data/blocks/button.raw');
var classNameJsx = getRawFile('./data/blocks/classname-jsx.raw');
var columns = getRawFile('./data/blocks/columns.raw');
var contentSlotHtml = getRawFile('./data/blocks/content-slot-html.raw');
var contentSlotJsx = getRawFile('./data/blocks/content-slot-jsx.raw');
var customCode = getRawFile('./data/blocks/custom-code.raw');
var formBlock = getRawFile('./data/blocks/form.raw');
var image = getRawFile('./data/blocks/image.raw');
var imageState = getRawFile('./data/blocks/img-state.raw');
var img = getRawFile('./data/blocks/img.raw');
var inputBlock = getRawFile('./data/blocks/input.raw');
var multipleOnUpdate = getRawFile('./data/blocks/multiple-onUpdate.raw');
var multipleOnUpdateWithDeps = getRawFile('./data/blocks/multiple-onUpdateWithDeps.raw');
var onInit = getRawFile('./data/blocks/onInit.raw');
var onInitonMount = getRawFile('./data/blocks/onInit-onMount.raw');
var onMount = getRawFile('./data/blocks/onMount.raw');
var onUpdate = getRawFile('./data/blocks/onUpdate.raw');
var onUpdateWithDeps = getRawFile('./data/blocks/onUpdateWithDeps.raw');
var rawText = getRawFile('./data/blocks/raw-text.raw');
var section = getRawFile('./data/blocks/section.raw');
var sectionState = getRawFile('./data/blocks/section-state.raw');
var selectBlock = getRawFile('./data/blocks/select.raw');
var selfRefCompWChildren = getRawFile('./data/blocks/self-referencing-component-with-children.raw');
var selfRefComp = getRawFile('./data/blocks/self-referencing-component.raw');
var slotHtml = getRawFile('./data/blocks/slot-html.raw');
var slotJsx = getRawFile('./data/blocks/slot-jsx.raw');
var stamped = getRawFile('./data/blocks/stamped-io.raw');
var submitButtonBlock = getRawFile('./data/blocks/submit-button.raw');
var text = getRawFile('./data/blocks/text.raw');
var textarea = getRawFile('./data/blocks/textarea.raw');
var video = getRawFile('./data/blocks/video.raw');
var multipleSpreads = getRawFile('./data/spread/multiple-spreads.raw');
var spreadAttrs = getRawFile('./data/spread/spread-attrs.raw');
var spreadNestedProps = getRawFile('./data/spread/spread-nested-props.raw');
var spreadProps = getRawFile('./data/spread/spread-props.raw');
var builderRenderContent = getRawFile('./data/blocks/builder-render-content.raw');
var rootFragmentMultiNode = getRawFile('./data/blocks/root-fragment-multi-node.raw');
var renderContentExample = getRawFile('./data/render-content.raw');
var path = 'test-path';
var BASIC_TESTS = {
    Basic: basic,
    BasicAttribute: basicAttribute,
    BasicBooleanAttribute: basicBooleanAttribute,
    BasicRef: basicRef,
    BasicRefPrevious: basicRefPrevious,
    BasicRefAssignment: basicRefAssignment,
    BasicChildComponent: basicChildComponent,
    BasicFor: basicFor,
    Input: inputBlock,
    Submit: submitButtonBlock,
    Select: selectBlock,
    Button: button,
    Textarea: textarea,
    Img: img,
    Video: video,
    Section: section,
    Text: text,
    RawText: rawText,
    'Stamped.io': stamped,
    CustomCode: customCode,
    Embed: customCode,
    Image: image,
    Columns: columns,
    onUpdate: onUpdate,
    onInit: onInit,
    onUpdateWithDeps: onUpdateWithDeps,
    onMount: onMount,
    propsType: propsType,
    propsInterface: propsInterface,
    defaultProps: defaultProps,
    defaultPropsOutsideComponent: defaultPropsOutsideComponent,
    preserveTyping: preserveTyping,
    typeDependency: typeDependency,
    defaultValsWithTypes: getRawFile('./data/types/component-with-default-values-types.raw'),
    'import types': builderRenderContent,
    subComponent: subComponent,
    nestedStyles: nestedStyles,
    propsDestructure: propsDestructure,
    'onInit & onMount': onInitonMount,
    'Basic Context': basicContext,
    'Basic Outputs Meta': basicOutputsMeta,
    'Basic Outputs': basicOutputs,
    className: classNameJsx,
    'Image State': imageState,
    'Basic OnMount Update': basicOnMountUpdate,
    preserveExportOrLocalStatement: preserveExportOrLocalStatement,
    'class + css': classRaw,
    'className + css': className,
    'class + ClassName + css': classAndClassName,
    'use-style': useStyle,
    'use-style-and-css': useStyleAndCss,
    'use-style-outside-component': useStyleOutsideComponent,
    'self-referencing component with children': selfRefCompWChildren,
    'self-referencing component': selfRefComp,
    rootFragmentMultiNode: rootFragmentMultiNode,
    multipleSpreads: multipleSpreads,
    spreadAttrs: spreadAttrs,
    spreadNestedProps: spreadNestedProps,
    spreadProps: spreadProps,
    renderContentExample: renderContentExample,
    arrowFunctionInUseStore: arrowFunctionInUseStore,
};
var SLOTS_TESTS = {
    ContentSlotJSX: contentSlotJsx,
    ContentSlotHtml: contentSlotHtml,
    SlotJsx: slotJsx,
    SlotHtml: slotHtml,
    classState: classState,
};
var MULTI_ON_UPDATE_TESTS = {
    multipleOnUpdate: multipleOnUpdate,
    multipleOnUpdateWithDeps: multipleOnUpdateWithDeps,
};
var FORM_BLOCK_TESTS = {
    Form: formBlock,
};
var FOR_SHOW_TESTS = {
    Section: sectionState,
    Basic: basicForShow,
};
var FORWARD_REF_TESTS = {
    basicForwardRef: basicForwardRef,
    basicForwardRefMetadata: basicForwardRefMetadata,
};
var SHOW_TESTS = {
    rootShow: getRawFile('./data/blocks/rootShow.raw'),
    nestedShow: getRawFile('./data/show/nested-show.raw'),
    showWithFor: getRawFile('./data/show/show-with-for.raw'),
};
var ADVANCED_REF = {
    AdvancedRef: getRawFile('./data/advanced-ref.raw'),
};
var ON_UPDATE_RETURN = {
    basicOnUpdateReturn: getRawFile('./data/basic-onUpdate-return.raw'),
};
var IMPORT_TEST = {
    importRaw: getRawFile('./data/import.raw'),
};
var CONTEXT_TEST = {
    componentWithContext: componentWithContext,
};
var JSX_TESTS = [
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    FOR_SHOW_TESTS,
    CONTEXT_TEST,
];
var TESTS_FOR_TARGET = {
    alpine: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    react: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    rsc: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    angular: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        IMPORT_TEST,
    ],
    lit: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    marko: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    webcomponent: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FORM_BLOCK_TESTS
    ],
    vue: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    svelte: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    html: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FORM_BLOCK_TESTS
    ],
    stencil: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        // ROOT_SHOW_TESTS,
        FORWARD_REF_TESTS,
        // MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS
    ],
    solid: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        // FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    reactNative: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
        // FOR_SHOW_TESTS,
    ],
    liquid: [
        CONTEXT_TEST,
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        ADVANCED_REF,
        ON_UPDATE_RETURN,
    ],
    qwik: [
        BASIC_TESTS,
        SLOTS_TESTS,
        SHOW_TESTS,
        FORWARD_REF_TESTS,
        MULTI_ON_UPDATE_TESTS,
        FORM_BLOCK_TESTS,
        FOR_SHOW_TESTS,
    ],
};
var runTestsForJsx = function () {
    test('Remove Internal mitosis package', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = jsx_1.parseJsx;
                    return [4 /*yield*/, basicMitosis];
                case 1:
                    component = _a.apply(void 0, [_b.sent(), {
                            compileAwayPackages: ['@dummy/custom-mitosis'],
                        }]);
                    expect(component).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    JSX_TESTS.forEach(function (tests) {
        Object.keys(tests).forEach(function (key) {
            test(key, function () { return __awaiter(void 0, void 0, void 0, function () {
                var component, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = jsx_1.parseJsx;
                            return [4 /*yield*/, tests[key]];
                        case 1:
                            component = _a.apply(void 0, [_b.sent()]);
                            expect(component).toMatchSnapshot();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
};
exports.runTestsForJsx = runTestsForJsx;
var runTestsForTarget = function (_a) {
    var target = _a.target, generator = _a.generator, options = _a.options;
    var testsArray = TESTS_FOR_TARGET[target];
    test('Remove Internal mitosis package', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, _a, output;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = jsx_1.parseJsx;
                    return [4 /*yield*/, basicMitosis];
                case 1:
                    component = _a.apply(void 0, [_b.sent(), {
                            compileAwayPackages: ['@dummy/custom-mitosis'],
                        }]);
                    output = generator(options)({ component: component, path: path });
                    expect(output).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    var configurations = [
        { options: __assign(__assign({}, options), { typescript: false }), testName: 'Javascript Test' },
        { options: __assign(__assign({}, options), { typescript: true }), testName: 'Typescript Test' },
    ];
    if (testsArray) {
        configurations.forEach(function (_a) {
            var options = _a.options, testName = _a.testName;
            describe(testName, function () {
                testsArray.forEach(function (tests) {
                    Object.keys(tests).forEach(function (key) {
                        test(key, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var component, _a, getOutput;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = jsx_1.parseJsx;
                                        return [4 /*yield*/, tests[key]];
                                    case 1:
                                        component = _a.apply(void 0, [_b.sent(), { typescript: options.typescript }]);
                                        getOutput = function () { return generator(options)({ component: component, path: path }); };
                                        try {
                                            expect(getOutput()).toMatchSnapshot();
                                        }
                                        catch (error) {
                                            expect(getOutput).toThrowErrorMatchingSnapshot();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                });
            });
        });
    }
};
exports.runTestsForTarget = runTestsForTarget;
