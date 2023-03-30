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
exports.runTestsForTarget = exports.runTestsForSvelteSyntax = exports.runTestsForJsx = void 0;
var jsx_1 = require("../parsers/jsx");
var __1 = require("..");
var getRawFile = function (path) { return Promise.resolve().then(function () { return __importStar(require("".concat(path, "?raw"))); }).then(function (x) { return x.default; }); };
var basicForShow = getRawFile('./data/basic-for-show.raw.tsx');
var basicBooleanAttribute = getRawFile('./data/basic-boolean-attribute.raw.tsx');
var basicOnMountUpdate = getRawFile('./data/basic-onMount-update.raw.tsx');
var basicContext = getRawFile('./data/basic-context.raw.tsx');
var basicOutputsMeta = getRawFile('./data/basic-outputs-meta.raw.tsx');
var basicOutputs = getRawFile('./data/basic-outputs.raw.tsx');
var subComponent = getRawFile('./data/sub-component.raw.tsx');
var componentWithContext = getRawFile('./data/context/component-with-context.raw.tsx');
var componentWithContextMultiRoot = getRawFile('./data/context/component-with-context-multi-root.raw.tsx');
var expressionState = getRawFile('./data/expression-state.raw.tsx');
var contentState = getRawFile('./data/context-state.raw.tsx');
var basic = getRawFile('./data/basic.raw.tsx');
var basicAttribute = getRawFile('./data/basic-attribute.raw.tsx');
var basicMitosis = getRawFile('./data/basic-custom-mitosis-package.raw.tsx');
var basicChildComponent = getRawFile('./data/basic-child-component.raw.tsx');
var basicFor = getRawFile('./data/basic-for.raw.tsx');
var basicRef = getRawFile('./data/basic-ref.raw.tsx');
var basicForwardRef = getRawFile('./data/basic-forwardRef.raw.tsx');
var basicForwardRefMetadata = getRawFile('./data/basic-forwardRef-metadata.raw.tsx');
var basicRefPrevious = getRawFile('./data/basic-ref-usePrevious.raw.tsx');
var basicRefAssignment = getRawFile('./data/basic-ref-assignment.raw.tsx');
var propsDestructure = getRawFile('./data/basic-props-destructure.raw.tsx');
var nestedStyles = getRawFile('./data/nested-styles.raw.tsx');
var preserveExportOrLocalStatement = getRawFile('./data/basic-preserve-export-or-local-statement.raw.tsx');
var arrowFunctionInUseStore = getRawFile('./data/arrow-function-in-use-store.raw.tsx');
var svgComponent = getRawFile('./data/svg.raw.tsx');
var propsType = getRawFile('./data/types/component-props-type.raw.tsx');
var propsInterface = getRawFile('./data/types/component-props-interface.raw.tsx');
var preserveTyping = getRawFile('./data/types/preserve-typing.raw.tsx');
var typeDependency = getRawFile('./data/types/type-dependency.raw.tsx');
var defaultProps = getRawFile('./data/default-props/default-props.raw.tsx');
var defaultPropsOutsideComponent = getRawFile('./data/default-props/default-props-outside-component.raw.tsx');
var classRaw = getRawFile('./data/styles/class.raw.tsx');
var className = getRawFile('./data/styles/className.raw.tsx');
var classAndClassName = getRawFile('./data/styles/class-and-className.raw.tsx');
var classState = getRawFile('./data/styles/classState.raw.tsx');
var useStyle = getRawFile('./data/styles/use-style.raw.tsx');
var useStyleOutsideComponent = getRawFile('./data/styles/use-style-outside-component.raw.tsx');
var useStyleAndCss = getRawFile('./data/styles/use-style-and-css.raw.tsx');
var styleClassAndCss = getRawFile('./data/styles/style-class-and-css.raw.tsx');
var button = getRawFile('./data/blocks/button.raw.tsx');
var classNameJsx = getRawFile('./data/blocks/classname-jsx.raw.tsx');
var columns = getRawFile('./data/blocks/columns.raw.tsx');
var contentSlotHtml = getRawFile('./data/blocks/content-slot-html.raw.tsx');
var contentSlotJsx = getRawFile('./data/blocks/content-slot-jsx.raw.tsx');
var customCode = getRawFile('./data/blocks/custom-code.raw.tsx');
var formBlock = getRawFile('./data/blocks/form.raw.tsx');
var image = getRawFile('./data/blocks/image.raw.tsx');
var imageState = getRawFile('./data/blocks/img-state.raw.tsx');
var img = getRawFile('./data/blocks/img.raw.tsx');
var inputBlock = getRawFile('./data/blocks/input.raw.tsx');
var multipleOnUpdate = getRawFile('./data/blocks/multiple-onUpdate.raw.tsx');
var multipleOnUpdateWithDeps = getRawFile('./data/blocks/multiple-onUpdateWithDeps.raw.tsx');
var onInit = getRawFile('./data/blocks/onInit.raw.tsx');
var onInitonMount = getRawFile('./data/blocks/onInit-onMount.raw.tsx');
var onMount = getRawFile('./data/blocks/onMount.raw.tsx');
var onUpdate = getRawFile('./data/blocks/onUpdate.raw.tsx');
var onUpdateWithDeps = getRawFile('./data/blocks/onUpdateWithDeps.raw.tsx');
var rawText = getRawFile('./data/blocks/raw-text.raw.tsx');
var section = getRawFile('./data/blocks/section.raw.tsx');
var sectionState = getRawFile('./data/blocks/section-state.raw.tsx');
var selectBlock = getRawFile('./data/blocks/select.raw.tsx');
var selfRefCompWChildren = getRawFile('./data/blocks/self-referencing-component-with-children.raw.tsx');
var selfRefComp = getRawFile('./data/blocks/self-referencing-component.raw.tsx');
var slotDefault = getRawFile('./data/blocks/slot-default.raw.tsx');
var slotHtml = getRawFile('./data/blocks/slot-html.raw.tsx');
var slotJsx = getRawFile('./data/blocks/slot-jsx.raw.tsx');
var slotNamed = getRawFile('./data/blocks/slot-named.raw.tsx');
var stamped = getRawFile('./data/blocks/stamped-io.raw.tsx');
var submitButtonBlock = getRawFile('./data/blocks/submit-button.raw.tsx');
var text = getRawFile('./data/blocks/text.raw.tsx');
var textarea = getRawFile('./data/blocks/textarea.raw.tsx');
var video = getRawFile('./data/blocks/video.raw.tsx');
var referencingFunInsideHook = getRawFile('./data/blocks/referencing-function-inside-hook.raw.tsx');
var renderBlock = getRawFile('./data/blocks/render-block.raw.tsx');
var multipleSpreads = getRawFile('./data/spread/multiple-spreads.raw.tsx');
var spreadAttrs = getRawFile('./data/spread/spread-attrs.raw.tsx');
var spreadNestedProps = getRawFile('./data/spread/spread-nested-props.raw.tsx');
var spreadProps = getRawFile('./data/spread/spread-props.raw.tsx');
var builderRenderContent = getRawFile('./data/blocks/builder-render-content.raw.tsx');
var rootFragmentMultiNode = getRawFile('./data/blocks/root-fragment-multi-node.raw.tsx');
var renderContentExample = getRawFile('./data/render-content.raw.tsx');
var path = 'test-path';
var SVELTE_SYNTAX_TESTS = {
    basic: getRawFile('./syntax/svelte/basic.raw.svelte'),
    bindGroup: getRawFile('./syntax/svelte/bind-group.raw.svelte'),
    bindProperty: getRawFile('./syntax/svelte/bind-property.raw.svelte'),
    classDirective: getRawFile('./syntax/svelte/class-directive.raw.svelte'),
    context: getRawFile('./syntax/svelte/context.raw.svelte'),
    each: getRawFile('./syntax/svelte/each.raw.svelte'),
    html: getRawFile('./syntax/svelte/html.raw.svelte'),
    eventHandlers: getRawFile('./syntax/svelte/event-handlers.raw.svelte'),
    ifElse: getRawFile('./syntax/svelte/if-else.raw.svelte'),
    imports: getRawFile('./syntax/svelte/imports.raw.svelte'),
    lifecycleHooks: getRawFile('./syntax/svelte/lifecycle-hooks.raw.svelte'),
    reactive: getRawFile('./syntax/svelte/reactive.raw.svelte'),
    reactiveWithFn: getRawFile('./syntax/svelte/reactive-with-fn.raw.svelte'),
    slots: getRawFile('./syntax/svelte/slots.raw.svelte'),
    style: getRawFile('./syntax/svelte/style.raw.svelte'),
    textExpressions: getRawFile('./syntax/svelte/text-expressions.raw.svelte'),
};
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
    defaultValsWithTypes: getRawFile('./data/types/component-with-default-values-types.raw.tsx'),
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
    styleClassAndCss: styleClassAndCss,
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
    expressionState: expressionState,
    contentState: contentState,
    referencingFunInsideHook: referencingFunInsideHook,
    svgComponent: svgComponent,
    renderBlock: renderBlock,
};
var SLOTS_TESTS = {
    ContentSlotJSX: contentSlotJsx,
    ContentSlotHtml: contentSlotHtml,
    SlotDefault: slotDefault,
    SlotJsx: slotJsx,
    SlotHtml: slotHtml,
    SlotNamed: slotNamed,
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
    rootShow: getRawFile('./data/blocks/rootShow.raw.tsx'),
    nestedShow: getRawFile('./data/show/nested-show.raw.tsx'),
    showWithFor: getRawFile('./data/show/show-with-for.raw.tsx'),
};
var ADVANCED_REF = {
    AdvancedRef: getRawFile('./data/advanced-ref.raw.tsx'),
};
var ON_UPDATE_RETURN = {
    basicOnUpdateReturn: getRawFile('./data/basic-onUpdate-return.raw.tsx'),
};
var IMPORT_TEST = {
    importRaw: getRawFile('./data/import.raw.tsx'),
};
var OUTPUT_EVENT_BINDINGS_TEST = {
    outputEventBinding: getRawFile('./data/output-event-bindings.raw.tsx'),
};
var CONTEXT_TEST = {
    componentWithContext: componentWithContext,
    componentWithContextMultiRoot: componentWithContextMultiRoot,
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
var JSX_TESTS_FOR_TARGET = {
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
        OUTPUT_EVENT_BINDINGS_TEST,
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
        SLOTS_TESTS,
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
    taro: [
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
var runTestsForSvelteSyntax = function () {
    Object.keys(SVELTE_SYNTAX_TESTS).forEach(function (key) {
        test(key, function () { return __awaiter(void 0, void 0, void 0, function () {
            var component, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __1.parseSvelte;
                        return [4 /*yield*/, SVELTE_SYNTAX_TESTS[key]];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 2:
                        component = _b.sent();
                        expect(component).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
    });
};
exports.runTestsForSvelteSyntax = runTestsForSvelteSyntax;
var runTestsForTarget = function (_a) {
    var target = _a.target, generator = _a.generator, options = _a.options;
    var configurations = [
        { options: __assign(__assign({}, options), { typescript: false }), testName: 'Javascript Test' },
        { options: __assign(__assign({}, options), { typescript: true }), testName: 'Typescript Test' },
    ];
    var parsers = [
        {
            name: 'jsx',
            parser: function (x) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, jsx_1.parseJsx)(x, { typescript: options.typescript })];
            }); }); },
            testsArray: JSX_TESTS_FOR_TARGET[target],
        },
        {
            name: 'svelte',
            parser: function (x) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, __1.parseSvelte)(x)];
            }); }); },
            testsArray: [SVELTE_SYNTAX_TESTS],
        },
    ];
    var _loop_1 = function (name_1, parser, testsArray) {
        if (testsArray) {
            describe(name_1, function () {
                configurations.forEach(function (_a) {
                    var options = _a.options, testName = _a.testName;
                    if (name_1 === 'jsx' && options.typescript === false) {
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
                    }
                    describe(testName, function () {
                        testsArray.forEach(function (tests) {
                            Object.keys(tests).forEach(function (key) {
                                test(key, function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var component, _a, getOutput;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = parser;
                                                return [4 /*yield*/, tests[key]];
                                            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                                            case 2:
                                                component = _b.sent();
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
            });
        }
    };
    for (var _i = 0, parsers_1 = parsers; _i < parsers_1.length; _i++) {
        var _b = parsers_1[_i], name_1 = _b.name, parser = _b.parser, testsArray = _b.testsArray;
        _loop_1(name_1, parser, testsArray);
    }
};
exports.runTestsForTarget = runTestsForTarget;
